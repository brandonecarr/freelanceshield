import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { RiskReport } from '@/components/review/RiskReport'
import { Clause, Review } from '@/lib/types'
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'

interface ReviewPageProps {
  params: { id: string }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch the review
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (reviewError || !review) {
    notFound()
  }

  // Fetch profile for plan info
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan || 'free'

  // If still processing, show loading state
  if (review.status === 'processing' || review.status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your contract...</h2>
        <p className="text-gray-500 text-sm">This usually takes 30–60 seconds. The page will refresh automatically.</p>
        <meta httpEquiv="refresh" content="5" />
      </div>
    )
  }

  // If error
  if (review.status === 'error') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex gap-4">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Analysis failed</h3>
            <p className="text-red-700 text-sm">
              {review.error_message || 'Something went wrong. Please try uploading your contract again.'}
            </p>
            <Link
              href="/review/new"
              className="mt-4 inline-block text-sm font-medium text-red-700 hover:text-red-900 underline"
            >
              Try again
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Fetch clauses
  const { data: clauses } = await supabase
    .from('clauses')
    .select('*')
    .eq('review_id', review.id)

  // Sort clauses: high first, then medium, then low
  const riskOrder = { high: 0, medium: 1, low: 2 }
  const sortedClauses = (clauses || []).sort((a: Clause, b: Clause) => {
    const aOrder = riskOrder[a.risk_level as keyof typeof riskOrder] ?? 3
    const bOrder = riskOrder[b.risk_level as keyof typeof riskOrder] ?? 3
    if (aOrder !== bOrder) return aOrder - bOrder
    return (a.sort_order ?? 0) - (b.sort_order ?? 0)
  })

  const reviewWithClauses: Review & { clauses: Clause[] } = {
    ...(review as Review),
    clauses: sortedClauses,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <RiskReport review={reviewWithClauses} plan={plan} />
    </div>
  )
}
