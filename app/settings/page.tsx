'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { FreelancerType, US_STATES, PLAN_LIMITS } from '@/lib/types'
import { PLAN_DETAILS } from '@/lib/stripe'
import { FreelancerTypeSelector } from '@/components/review/FreelancerTypeSelector'
import { CheckCircle, CreditCard, User, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const supabase = createBrowserSupabaseClient()
  const [profile, setProfile] = useState<{
    email: string
    freelancer_type: FreelancerType | null
    us_state: string | null
    plan: string
    reviews_used_this_month: number
  } | null>(null)
  const [freelancerType, setFreelancerType] = useState<FreelancerType | null>(null)
  const [usState, setUsState] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile({ ...data, email: user.email || '' })
        setFreelancerType(data.freelancer_type)
        setUsState(data.us_state || '')
      }
      setLoading(false)
    }
    loadProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSaveProfile() {
    setSaving(true)
    await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ freelancer_type: freelancerType, us_state: usState }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleUpgrade(plan: string) {
    setUpgrading(true)
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await response.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setUpgrading(false)
      alert('Failed to create checkout session. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  const plan = profile?.plan || 'free'
  const planLimits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
  const isUnlimited = planLimits.reviews_per_month === Infinity

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Profile */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-gray-500" />
          <h2 className="text-base font-semibold text-gray-900">Profile</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
              {profile?.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Freelancer type
            </label>
            <FreelancerTypeSelector value={freelancerType} onChange={setFreelancerType} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              value={usState}
              onChange={(e) => setUsState(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select your state...</option>
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : null}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
          </button>
        </div>
      </section>

      {/* Billing / Plan */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <h2 className="text-base font-semibold text-gray-900">Plan & Billing</h2>
        </div>

        {/* Current plan */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 capitalize">{plan} Plan</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {isUnlimited
                  ? 'Unlimited contract reviews'
                  : `${profile?.reviews_used_this_month || 0} / ${planLimits.reviews_per_month} reviews used this month`}
              </p>
            </div>
            {plan !== 'free' && (
              <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Upgrade options */}
        {plan === 'free' && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-900">Upgrade your plan</p>

            <div className="border-2 border-blue-500 rounded-xl p-5 bg-blue-50/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900">
                    {PLAN_DETAILS.solo.name}
                    <span className="ml-2 text-blue-600">${PLAN_DETAILS.solo.price}/month</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{PLAN_DETAILS.solo.description}</p>
                  <ul className="mt-3 space-y-1.5">
                    {PLAN_DETAILS.solo.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => handleUpgrade('solo')}
                disabled={upgrading}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {upgrading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {upgrading ? 'Redirecting...' : 'Upgrade to Solo — $29/month'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    Pro — $59/month
                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Coming soon</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">Everything in Solo + negotiation coaching, redline comparison, demand letters</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {plan !== 'free' && (
          <p className="text-sm text-gray-500">
            To manage your subscription, cancel, or update payment details, please contact support.
          </p>
        )}
      </section>
    </div>
  )
}
