import { NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { getStripe } from '@/lib/stripe'

export async function DELETE() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serviceClient = createServiceRoleClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('stripe_customer_id, stripe_subscription_id')
    .eq('id', user.id)
    .single()

  // Cancel active Stripe subscription if one exists
  if (profile?.stripe_subscription_id) {
    try {
      await getStripe().subscriptions.cancel(profile.stripe_subscription_id)
    } catch (err) {
      console.error('[delete-account] Failed to cancel subscription:', err)
      // Continue with deletion even if Stripe cancellation fails
    }
  }

  // Delete the auth user — cascades to public.profiles via FK on delete cascade
  const { error: deleteError } = await serviceClient.auth.admin.deleteUser(user.id)
  if (deleteError) {
    console.error('[delete-account] Failed to delete user:', deleteError)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
