import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { generateNegotiationCoaching } from '@/lib/claude'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify Pro or Agency plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, freelancer_type, us_state')
    .eq('id', user.id)
    .single()

  if (!profile || !['pro', 'agency'].includes(profile.plan)) {
    return NextResponse.json(
      { error: 'Negotiation coaching requires a Pro plan or higher.' },
      { status: 403 }
    )
  }

  const { clause_id } = await req.json()

  if (!clause_id) {
    return NextResponse.json({ error: 'clause_id is required' }, { status: 400 })
  }

  // Fetch the clause and verify ownership via the review
  const { data: clause } = await supabase
    .from('clauses')
    .select('*, reviews!inner(user_id, freelancer_type, us_state)')
    .eq('id', clause_id)
    .eq('review_id', params.id)
    .single()

  if (!clause) {
    return NextResponse.json({ error: 'Clause not found' }, { status: 404 })
  }

  // Ownership check
  const reviewUserId = (clause.reviews as { user_id: string })?.user_id
  if (reviewUserId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const freelancerType = profile.freelancer_type || 'other'
  const usState = profile.us_state || 'united_states'

  try {
    const coaching = await generateNegotiationCoaching(
      clause.clause_type,
      clause.original_text || '',
      clause.specific_concern || '',
      freelancerType,
      usState
    )
    return NextResponse.json(coaching)
  } catch (err) {
    console.error('[negotiate] Claude error:', err)
    return NextResponse.json(
      { error: 'Failed to generate coaching. Please try again.' },
      { status: 500 }
    )
  }
}
