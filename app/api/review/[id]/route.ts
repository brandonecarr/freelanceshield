import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const reviewId = params.id

  // Fetch review (RLS ensures user can only see their own)
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .eq('user_id', user.id)
    .single()

  if (reviewError || !review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 })
  }

  // Fetch clauses for this review
  const { data: clauses, error: clausesError } = await supabase
    .from('clauses')
    .select('*')
    .eq('review_id', reviewId)
    .order('risk_level', { ascending: false })
    .order('sort_order', { ascending: true })

  if (clausesError) {
    console.error('[review-get] Failed to fetch clauses:', clausesError)
  }

  // Sort clauses: high risk first, then medium, then low
  const riskOrder = { high: 0, medium: 1, low: 2 }
  const sortedClauses = (clauses || []).sort((a, b) => {
    const aOrder = riskOrder[a.risk_level as keyof typeof riskOrder] ?? 3
    const bOrder = riskOrder[b.risk_level as keyof typeof riskOrder] ?? 3
    if (aOrder !== bOrder) return aOrder - bOrder
    return (a.sort_order ?? 0) - (b.sort_order ?? 0)
  })

  return NextResponse.json({
    review: {
      ...review,
      clauses: sortedClauses,
    },
  })
}
