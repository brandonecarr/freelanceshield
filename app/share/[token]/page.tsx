import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Shield, FileText, AlertTriangle } from 'lucide-react'
import { createServiceRoleClient } from '@/lib/supabase-server'
import { RiskBadge } from '@/components/review/RiskBadge'
import { RiskScoreRing } from '@/components/review/RiskScoreRing'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function SharedReviewPage({
  params,
}: {
  params: { token: string }
}) {
  const serviceClient = createServiceRoleClient()

  const { data: review } = await serviceClient
    .from('reviews')
    .select('*, clauses(*)')
    .eq('share_token', params.token)
    .eq('status', 'complete')
    .single()

  if (!review) notFound()

  const clauses = review.clauses || []
  const highRiskCount = clauses.filter((c: { risk_level: string }) => c.risk_level === 'high').length

  // Sort clauses by sort_order
  const sortedClauses = [...clauses].sort(
    (a: { sort_order: number | null }, b: { sort_order: number | null }) =>
      (a.sort_order ?? 99) - (b.sort_order ?? 99)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared review banner */}
      <div className="bg-blue-600 text-white text-center py-2.5 px-4">
        <p className="text-sm">
          This contract review was shared via{' '}
          <Link href="/" className="font-semibold underline underline-offset-2">
            FreelanceShield
          </Link>{' '}
          — AI contract review for freelancers.{' '}
          <Link href="/auth/signup" className="font-semibold underline underline-offset-2">
            Try it free &rarr;
          </Link>
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-4">
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

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              FreelanceShield is a software tool that explains contract language. It is not a law firm and does not provide legal advice. Nothing in this analysis creates an attorney-client relationship.
            </p>
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

          {sortedClauses.map((clause: {
            id: string
            clause_type: string
            original_text: string | null
            risk_level: 'low' | 'medium' | 'high'
            plain_english: string | null
            specific_concern: string | null
          }) => (
            <div key={clause.id} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-semibold text-gray-900">{clause.clause_type}</h3>
                <RiskBadge level={clause.risk_level} />
              </div>

              {clause.original_text && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Contract Language
                  </p>
                  <blockquote className="border-l-4 border-gray-200 pl-4 bg-gray-50 py-3 rounded-r-md">
                    <p className="font-mono text-sm text-gray-700 leading-relaxed">
                      &ldquo;{clause.original_text}&rdquo;
                    </p>
                  </blockquote>
                </div>
              )}

              {clause.plain_english && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    What This Means
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{clause.plain_english}</p>
                </div>
              )}

              {clause.specific_concern && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                      Why This Is a Problem
                    </p>
                    <p className="text-sm text-amber-900">{clause.specific_concern}</p>
                  </div>
                </div>
              )}

              {/* No suggested edits on shared view — they're a paid feature */}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-blue-600 rounded-xl p-6 text-white text-center">
          <Shield className="h-8 w-8 text-blue-200 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Review your own contracts</h3>
          <p className="text-blue-100 text-sm mb-4">
            Get plain-English clause analysis, suggested replacement language, and state-specific legal flags — in under 60 seconds.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
          >
            Try FreelanceShield free
          </Link>
        </div>
      </div>
    </div>
  )
}
