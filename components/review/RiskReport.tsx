'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Review, Clause, FREE_CLAUSE_LIMIT } from '@/lib/types'
import { ClauseCard } from './ClauseCard'
import { RiskScoreRing } from './RiskScoreRing'
import { canAccessFullReport, formatDate } from '@/lib/utils'
import { Lock, AlertTriangle, FileText, Share2, Check } from 'lucide-react'

interface RiskReportProps {
  review: Review & { clauses: Clause[] }
  plan: string
}

export function RiskReport({ review, plan }: RiskReportProps) {
  const [shareCopied, setShareCopied] = useState(false)

  const isFullAccess = canAccessFullReport(plan)
  const isPro = plan === 'pro' || plan === 'agency'
  const clauses = review.clauses || []
  const visibleClauses = isFullAccess ? clauses : clauses.slice(0, FREE_CLAUSE_LIMIT)
  const hiddenCount = isFullAccess ? 0 : Math.max(0, clauses.length - FREE_CLAUSE_LIMIT)
  const highRiskCount = clauses.filter((c) => c.risk_level === 'high').length

  async function handleShare() {
    if (!review.share_token) return
    const url = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/share/${review.share_token}`
    await navigator.clipboard.writeText(url)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2500)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {review.overall_risk_score && (
            <div className="flex-shrink-0">
              <RiskScoreRing score={review.overall_risk_score} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-500 truncate">
                {review.file_name || 'Contract'}
              </span>
            </div>
            {review.risk_summary && (
              <p className="text-lg font-medium text-gray-900 leading-snug">
                {review.risk_summary}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Analyzed {formatDate(review.created_at)} &bull; {clauses.length} clauses found
            </p>
          </div>
        </div>

        {/* Share button + Legal disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-start justify-between gap-4">
          <p className="text-xs text-gray-500" style={{ fontSize: '12px' }}>
            FreelanceShield is a software tool that explains contract language. It is not a law firm and does not provide legal advice. Nothing in this analysis creates an attorney-client relationship. For contracts involving significant financial value or complex legal issues, consult a licensed attorney.
          </p>
          {review.share_token && (
            <button
              onClick={handleShare}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              {shareCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-green-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Clauses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Clause Analysis
          {clauses.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({clauses.length} clauses, {highRiskCount} high risk)
            </span>
          )}
        </h2>

        {clauses.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-800 font-medium">No concerning clauses found</p>
            <p className="text-green-700 text-sm mt-1">
              This contract appears to have standard, freelancer-friendly terms.
            </p>
          </div>
        )}

        {visibleClauses.map((clause) => (
          <ClauseCard
            key={clause.id}
            clause={clause}
            reviewId={review.id}
            showSuggestedEdit={isFullAccess}
            showNegotiationCoaching={isPro}
          />
        ))}

        {/* Paywall Gate */}
        {hiddenCount > 0 && (
          <div className="relative">
            {/* Blurred preview of next clause */}
            <div className="relative overflow-hidden rounded-lg">
              <div className="blur-sm pointer-events-none select-none">
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded w-40"></div>
                    <div className="h-5 bg-red-100 rounded-full w-20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                  <div className="bg-amber-50 rounded-md p-4 space-y-2">
                    <div className="h-4 bg-amber-100 rounded w-full"></div>
                    <div className="h-4 bg-amber-100 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              {/* Upgrade overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200">
                <Lock className="h-8 w-8 text-blue-600 mb-3" />
                <p className="text-lg font-semibold text-gray-900 text-center px-4">
                  Your contract has {hiddenCount} more {hiddenCount === 1 ? 'issue' : 'issues'} we found
                </p>
                <p className="text-sm text-gray-600 text-center px-6 mt-1">
                  Upgrade to see all of them and get suggested fixes
                </p>
                <Link
                  href="/settings?upgrade=true"
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                >
                  Upgrade to Solo — $29/month
                </Link>
                <p className="text-xs text-gray-500 mt-2">Unlimited reviews + full analysis</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attorney Escalation CTA (show for high-risk reports) */}
      {review.overall_risk_score && review.overall_risk_score >= 7 && (
        <div className="bg-gray-900 text-white rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg mb-1">
                This contract has significant issues
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Want a licensed attorney to review it for a flat $75 fee? 24-hour turnaround, specific to your state.
              </p>
              <button
                className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg font-medium text-sm hover:bg-yellow-300 transition-colors"
                onClick={() => {
                  alert('Attorney review coming soon! We\'ll notify you when this feature launches.')
                }}
              >
                Get attorney review — $75 flat fee
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Coming soon — we&apos;re building our attorney network
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
