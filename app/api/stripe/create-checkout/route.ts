import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { getStripe, PLAN_PRICE_IDS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan } = await request.json()

  const priceId = PLAN_PRICE_IDS[plan]
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const stripeClient = getStripe()
  const serviceClient = createServiceRoleClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  // Create Stripe customer if not exists
  if (!customerId) {
    const customer = await stripeClient.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await serviceClient
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripeClient.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/settings?canceled=true`,
    metadata: {
      supabase_user_id: user.id,
      plan,
    },
  })

  return NextResponse.json({ url: session.url })
}
