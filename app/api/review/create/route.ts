import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { analyzeContract } from '@/lib/claude'
import { PLAN_LIMITS } from '@/lib/types'
import { sendAnalysisComplete } from '@/lib/resend'

const MAX_REQUESTS_PER_HOUR = 10

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()

  // 1. Authenticate the user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Get user profile
  const serviceClient = createServiceRoleClient()
  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Check and reset monthly counter if needed
  const resetDate = new Date(profile.reviews_reset_date)
  const now = new Date()
  const daysSinceReset = (now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24)

  if (daysSinceReset >= 30) {
    await serviceClient
      .from('profiles')
      .update({ reviews_used_this_month: 0, reviews_reset_date: now.toISOString() })
      .eq('id', user.id)
    profile.reviews_used_this_month = 0
  }

  // Check monthly review limit
  const planLimits = PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
  if (
    planLimits.reviews_per_month !== Infinity &&
    profile.reviews_used_this_month >= planLimits.reviews_per_month
  ) {
    return NextResponse.json(
      {
        error: 'review_limit_reached',
        message: `You've used your ${planLimits.reviews_per_month} free review this month. Upgrade to Solo for unlimited reviews.`,
      },
      { status: 429 }
    )
  }

  // Hard rate limit: 10 requests per hour per user
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()
  const { count: recentReviews } = await serviceClient
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', oneHourAgo)

  if (recentReviews && recentReviews >= MAX_REQUESTS_PER_HOUR) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before submitting another review.' },
      { status: 429 }
    )
  }

  // 3. Accept the uploaded PDF via FormData
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const freelancerType = (formData.get('freelancer_type') as string) || profile.freelancer_type || 'other'
  const usState = (formData.get('us_state') as string) || profile.us_state || 'other'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 413 })
  }

  // 4. Extract text from the uploaded PDF using unpdf (serverless-compatible, no canvas dependency)
  let extractedText: string
  let pageCount: number

  try {
    const arrayBuffer = await file.arrayBuffer()
    const { extractText } = await import('unpdf')
    const { text, totalPages } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true })
    extractedText = (Array.isArray(text) ? text.join('\n') : (text as string)).trim()
    pageCount = totalPages
    void pageCount // available for future use

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json(
        {
          error:
            'Could not extract text from this PDF. Please ensure it is a text-based PDF and not a scanned image.',
        },
        { status: 422 }
      )
    }
  } catch (err) {
    console.error('[create-review] PDF parse error:', err)
    return NextResponse.json(
      { error: 'Failed to read the PDF file. Please ensure it is a valid, uncorrupted PDF.' },
      { status: 422 }
    )
  }

  // 5. Save the review row to Supabase with status 'processing'
  const { data: review, error: reviewError } = await serviceClient
    .from('reviews')
    .insert({
      user_id: user.id,
      file_name: file.name,
      raw_text: extractedText,
      freelancer_type: freelancerType,
      us_state: usState,
      status: 'processing',
    })
    .select()
    .single()

  if (reviewError || !review) {
    console.error('[create-review] Failed to create review:', reviewError)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }

  // 6. Call Claude with the extracted text, freelancer type, and state
  let analysisResult
  try {
    analysisResult = await analyzeContract(extractedText, freelancerType, usState)
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error('[create-review] Claude error:', errMsg)

    await serviceClient
      .from('reviews')
      .update({
        status: 'error',
        error_message: 'Analysis failed. Our AI service encountered an error. Please try again.',
      })
      .eq('id', review.id)

    return NextResponse.json(
      {
        error: 'Analysis failed. Our AI service encountered an error. Please try again.',
        review_id: review.id,
        debug: errMsg.slice(0, 300),
      },
      { status: 500 }
    )
  }

  // Handle non-contract documents
  if (!analysisResult.is_contract) {
    await serviceClient
      .from('reviews')
      .update({
        status: 'error',
        error_message: "This document doesn't look like a contract. FreelanceShield works best with service agreements, NDAs, and client contracts.",
      })
      .eq('id', review.id)

    return NextResponse.json(
      {
        error: "This document doesn't look like a contract. FreelanceShield works best with service agreements, NDAs, and client contracts.",
        review_id: review.id,
      },
      { status: 422 }
    )
  }

  // 7. Save all clause rows to Supabase
  if (analysisResult.clauses && analysisResult.clauses.length > 0) {
    const clauseRows = analysisResult.clauses.map((clause, index) => ({
      review_id: review.id,
      clause_type: clause.clause_type,
      original_text: clause.original_text,
      risk_level: clause.risk_level,
      plain_english: clause.plain_english,
      specific_concern: clause.specific_concern,
      suggested_edit: clause.suggested_edit,
      sort_order: clause.sort_order ?? index,
    }))

    const { error: clauseError } = await serviceClient
      .from('clauses')
      .insert(clauseRows)

    if (clauseError) {
      console.error('[create-review] Failed to save clauses:', clauseError)
    }
  }

  // 8. Update the review status to 'complete' and set the risk score
  await serviceClient
    .from('reviews')
    .update({
      status: 'complete',
      overall_risk_score: analysisResult.overall_risk_score,
      risk_summary: analysisResult.risk_summary,
    })
    .eq('id', review.id)

  // 9. Increment the user's reviews_used_this_month
  await serviceClient
    .from('profiles')
    .update({
      reviews_used_this_month: profile.reviews_used_this_month + 1,
    })
    .eq('id', user.id)

  // 10. Send analysis complete email (fire and forget — never block the response)
  if (profile.email) {
    sendAnalysisComplete(profile.email, review.id, analysisResult.overall_risk_score).catch((err) =>
      console.error('[create-review] Failed to send analysis email:', err)
    )
  }

  // 11. Return the review ID to the frontend
  return NextResponse.json({ review_id: review.id })
}
