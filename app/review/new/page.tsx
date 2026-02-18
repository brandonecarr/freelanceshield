'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UploadZone } from '@/components/review/UploadZone'
import { FreelancerTypeSelector } from '@/components/review/FreelancerTypeSelector'
import { OnboardingModal } from '@/components/OnboardingModal'
import { FreelancerType, US_STATES } from '@/lib/types'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { Loader2, Shield } from 'lucide-react'

export default function NewReviewPage() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  const [file, setFile] = useState<File | null>(null)
  const [freelancerType, setFreelancerType] = useState<FreelancerType | null>(null)
  const [usState, setUsState] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?next=/review/new')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('freelancer_type, us_state')
        .eq('id', user.id)
        .single()

      if (!profile?.freelancer_type || !profile?.us_state) {
        setShowOnboarding(true)
      } else {
        setFreelancerType(profile.freelancer_type as FreelancerType)
        setUsState(profile.us_state)
      }
      setProfileLoaded(true)
    }
    loadProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleOnboardingComplete(type: FreelancerType, state: string) {
    setFreelancerType(type)
    setUsState(state)
    setShowOnboarding(false)

    // Save to profile
    await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ freelancer_type: type, us_state: state }),
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !freelancerType || !usState) return

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('freelancer_type', freelancerType)
    formData.append('us_state', usState)

    const response = await fetch('/api/review/create', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error || data.message || 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.push(`/review/${data.review_id}`)
  }

  if (!profileLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <>
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-50 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Review a contract</h1>
          <p className="text-gray-500 text-sm mt-2">
            Upload your contract and get plain-English analysis in under 60 seconds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Contract PDF
            </label>
            <UploadZone onFileSelect={setFile} disabled={loading} />
          </div>

          {/* Freelancer type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Your freelancer type
              <span className="ml-1 text-xs font-normal text-gray-500">
                (affects how we flag certain clauses)
              </span>
            </label>
            <FreelancerTypeSelector value={freelancerType} onChange={setFreelancerType} />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your state
              <span className="ml-1 text-xs font-normal text-gray-500">
                (for state-specific legal rules)
              </span>
            </label>
            <select
              value={usState}
              onChange={(e) => setUsState(e.target.value)}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            >
              <option value="">Select your state...</option>
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || !freelancerType || !usState || loading}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing your contract...
              </>
            ) : (
              'Analyze contract'
            )}
          </button>

          {loading && (
            <p className="text-center text-sm text-gray-500">
              This takes about 30–60 seconds. Don&apos;t close this page.
            </p>
          )}

          <p className="text-center text-xs text-gray-400">
            Your contract is analyzed by AI and never shared with other users or third parties.
          </p>
        </form>
      </div>
    </>
  )
}
