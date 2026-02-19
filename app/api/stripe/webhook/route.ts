import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceRoleClient } from '@/lib/supabase-server'
import { sendPaymentFailed } from '@/lib/resend'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook] Invalid signature:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const serviceClient = createServiceRoleClient()

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const { data: profile } = await serviceClient
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        let plan = 'free'
        if (subscription.status === 'active') {
          const priceId = subscription.items.data[0]?.price?.id
          if (priceId && priceId === process.env.STRIPE_AGENCY_PRICE_ID) {
            plan = 'agency'
          } else if (priceId && priceId === process.env.STRIPE_PRO_PRICE_ID) {
            plan = 'pro'
          } else {
            plan = 'solo'
          }
        }
        await serviceClient
          .from('profiles')
          .update({ plan, stripe_subscription_id: subscription.id })
          .eq('id', profile.id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const { data: profile } = await serviceClient
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await serviceClient
          .from('profiles')
          .update({ plan: 'free', stripe_subscription_id: null })
          .eq('id', profile.id)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      const { data: profile } = await serviceClient
        .from('profiles')
        .select('email')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile?.email) {
        await sendPaymentFailed(profile.email)
      }
      // Do NOT immediately downgrade — give grace period
      break
    }

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      const plan = session.metadata?.plan || 'solo'

      if (userId) {
        await serviceClient
          .from('profiles')
          .update({ plan })
          .eq('id', userId)
      }
      break
    }

    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
