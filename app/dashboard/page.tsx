import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { PLAN_LIMITS } from '@/lib/types'
import { formatDate, getRiskLabel } from '@/lib/utils'
import { Upload, FileText, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'

function RiskScoreBadge({ score }: { score: number | null }) {
  if (!score) return null
  const color =
    score <= 3 ? 'text-green-700 bg-green-50 border-green-200' :
    score <= 6 ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
    'text-red-700 bg-red-50 border-red-200'
  return (
    <span className={`inline-flex items-center border rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
      {score}/10 · {getRiskLabel(score)}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    complete: { icon: CheckCircle, label: 'Complete', class: 'text-green-700' },
    processing: { icon: Clock, label: 'Analyzing...', class: 'text-blue-700' },
    pending: { icon: Clock, label: 'Pending', class: 'text-gray-500' },
    error: { icon: XCircle, label: 'Error', class: 'text-red-700' },
  }[status] || { icon: Clock, label: status, class: 'text-gray-500' }

  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${config.class}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const plan = profile?.plan || 'free'
  const planLimits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
  const reviewsUsed = profile?.reviews_used_this_month || 0
  const isUnlimited = planLimits.reviews_per_month === Infinity

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Contracts</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
        </div>
        <Link
          href="/review/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors self-start sm:self-auto"
        >
          <Upload className="h-4 w-4" />
          Review new contract
        </Link>
      </div>

      {/* Usage stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plan</p>
          <p className="text-xl font-bold text-gray-900 mt-1 capitalize">{plan}</p>
          {plan === 'free' && (
            <Link href="/settings?upgrade=true" className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block">
              Upgrade to Solo →
            </Link>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reviews This Month</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {reviewsUsed}
            {!isUnlimited && (
              <span className="text-sm font-normal text-gray-400"> / {planLimits.reviews_per_month}</span>
            )}
            {isUnlimited && <span className="text-sm font-normal text-gray-400"> (unlimited)</span>}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Reviews</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{reviews?.length || 0}</p>
        </div>
      </div>

      {/* Review limit warning for free tier */}
      {plan === 'free' && reviewsUsed >= 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900 text-sm">
              You&apos;ve used your free review this month
            </p>
            <p className="text-amber-700 text-sm mt-0.5">
              Upgrade to Solo for unlimited reviews and full clause analysis with suggested edits.{' '}
              <Link href="/settings?upgrade=true" className="font-medium underline">Upgrade now</Link>
            </p>
          </div>
        </div>
      )}

      {/* Review list */}
      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h3>
          <p className="text-gray-500 text-sm mb-6">Upload your first contract to get started</p>
          <Link
            href="/review/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Review a contract
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
            >
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {review.file_name || 'Contract'}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                  <StatusBadge status={review.status} />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {review.status === 'complete' && (
                  <RiskScoreBadge score={review.overall_risk_score} />
                )}
                {review.status === 'complete' && (
                  <Link
                    href={`/review/${review.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
