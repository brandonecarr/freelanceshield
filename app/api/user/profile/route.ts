import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json({ profile })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const allowedFields = ['freelancer_type', 'us_state']
  const updates: Record<string, string> = {}

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field]
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const serviceClient = createServiceRoleClient()
  const { data: profile, error } = await serviceClient
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  return NextResponse.json({ profile })
}
