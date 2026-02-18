import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'

async function assertAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin' ? user : null
}

export async function GET(request: NextRequest) {
  const adminUser = await assertAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const service = createServiceRoleClient()

  let query = service
    .from('reviews')
    .select(
      'id, user_id, file_name, overall_risk_score, status, freelancer_type, us_state, created_at, profiles!reviews_user_id_fkey(email)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.ilike('file_name', `%${search}%`)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data: reviews, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reviews: reviews ?? [], total: count ?? 0 })
}

export async function DELETE(request: NextRequest) {
  const adminUser = await assertAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { reviewId } = await request.json()
  if (!reviewId) {
    return NextResponse.json({ error: 'reviewId required' }, { status: 400 })
  }

  const service = createServiceRoleClient()

  // Delete clauses first (cascade should handle this but being explicit)
  await service.from('clauses').delete().eq('review_id', reviewId)
  const { error } = await service.from('reviews').delete().eq('id', reviewId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
