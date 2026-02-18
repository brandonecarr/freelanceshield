import Stripe from 'stripe'

// Lazy initialization — avoids failing at build time when env vars are empty
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
    })
  }
  return _stripe
}

// Keep a named export for convenience
export const stripe = {
  get instance() { return getStripe() },
  webhooks: {
    constructEvent: (...args: Parameters<Stripe['webhooks']['constructEvent']>) =>
      getStripe().webhooks.constructEvent(...args),
  },
  customers: {
    create: (...args: Parameters<Stripe['customers']['create']>) =>
      getStripe().customers.create(...args),
  },
  checkout: {
    sessions: {
      create: (...args: Parameters<Stripe['checkout']['sessions']['create']>) =>
        getStripe().checkout.sessions.create(...args),
    },
  },
}

export const PLAN_PRICE_IDS: Record<string, string | undefined> = {
  solo: process.env.STRIPE_SOLO_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  agency: process.env.STRIPE_AGENCY_PRICE_ID,
}

export const PLAN_DETAILS = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Get started with one review per month',
    features: [
      '1 contract review/month',
      'Top 3 risk clauses identified',
      'Plain-English explanations',
      'Risk score (1–10)',
    ],
    cta: 'Get started free',
  },
  solo: {
    name: 'Solo',
    price: 29,
    description: 'For active freelancers who sign contracts regularly',
    features: [
      'Unlimited contract reviews',
      'Full clause analysis (all categories)',
      'Suggested replacement language',
      'State-specific legal rules',
      'Access to 3 contract templates',
      'Review history vault',
    ],
    cta: 'Start Solo plan',
  },
  pro: {
    name: 'Pro',
    price: 59,
    description: 'For power users who negotiate every contract',
    features: [
      'Everything in Solo',
      'Negotiation coaching (coming soon)',
      'Clause comparison on redlines (coming soon)',
      'Payment demand letters (coming soon)',
      '10 contract templates',
    ],
    cta: 'Start Pro plan',
    comingSoon: true,
  },
  agency: {
    name: 'Agency',
    price: 149,
    description: 'For agencies and teams managing multiple freelancers',
    features: [
      'Everything in Pro',
      '5 team members',
      'Subcontractor templates',
      'Client portal (coming soon)',
      'Contract health dashboard (coming soon)',
    ],
    cta: 'Start Agency plan',
    comingSoon: true,
  },
}
