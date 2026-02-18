import { NextResponse } from 'next/server'
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

export async function GET() {
  const user = await assertAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createServiceRoleClient()

  const [
    { count: totalUsers },
    { count: totalReviews },
    { count: soloUsers },
    { count: freeUsers },
    { data: recentSignups },
    { data: recentReviews },
  ] = await Promise.all([
    service.from('profiles').select('*', { count: 'exact', head: true }),
    service.from('reviews').select('*', { count: 'exact', head: true }),
    service.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'solo'),
    service.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'free'),
    service.from('profiles').select('id, email, plan, role, created_at').order('created_at', { ascending: false }).limit(5),
    service.from('reviews').select('id, file_name, overall_risk_score, status, created_at, user_id').order('created_at', { ascending: false }).limit(5),
  ])

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    totalReviews: totalReviews ?? 0,
    soloUsers: soloUsers ?? 0,
    freeUsers: freeUsers ?? 0,
    recentSignups: recentSignups ?? [],
    recentReviews: recentReviews ?? [],
  })
}
