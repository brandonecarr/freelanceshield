'use client'

import { useState } from 'react'
import { Clause, NegotiationCoaching } from '@/lib/types'
import { RiskBadge } from './RiskBadge'
import { Copy, Check, AlertTriangle, MessageSquare, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface ClauseCardProps {
  clause: Clause
  reviewId: string
  showSuggestedEdit?: boolean
  showNegotiationCoaching?: boolean
}

export function ClauseCard({
  clause,
  reviewId,
  showSuggestedEdit = true,
  showNegotiationCoaching = false,
}: ClauseCardProps) {
  const [copied, setCopied] = useState(false)
  const [coaching, setCoaching] = useState<NegotiationCoaching | null>(null)
  const [coachingLoading, setCoachingLoading] = useState(false)
  const [coachingError, setCoachingError] = useState('')
  const [coachingOpen, setCoachingOpen] = useState(false)

  async function handleCopy() {
    if (!clause.suggested_edit) return
    await navigator.clipboard.writeText(clause.suggested_edit)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleGetCoaching() {
    if (coaching) {
      setCoachingOpen((o) => !o)
      return
    }
    setCoachingLoading(true)
    setCoachingError('')

    try {
      const response = await fetch(`/api/review/${reviewId}/negotiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clause_id: clause.id }),
      })
      const data = await response.json()
      if (!response.ok) {
        setCoachingError(data.error || 'Failed to load coaching.')
      } else {
        setCoaching(data)
        setCoachingOpen(true)
      }
    } catch {
      setCoachingError('Network error. Please try again.')
    } finally {
      setCoachingLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-semibold text-gray-900">{clause.clause_type}</h3>
        <RiskBadge level={clause.risk_level} />
      </div>

      {/* Original contract text */}
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

      {/* Plain English */}
      {clause.plain_english && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            What This Means
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{clause.plain_english}</p>
        </div>
      )}

      {/* Specific Concern */}
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

      {/* Suggested Edit */}
      {showSuggestedEdit && clause.suggested_edit && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Suggested Replacement
            </p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy to clipboard
                </>
              )}
            </button>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="font-mono text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">
              {clause.suggested_edit}
            </p>
          </div>
        </div>
      )}

      {/* Negotiation Coaching (Pro feature) */}
      {showNegotiationCoaching && (
        <div>
          <button
            onClick={handleGetCoaching}
            disabled={coachingLoading}
            className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 border border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
          >
            {coachingLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Getting coaching...
              </>
            ) : coaching ? (
              <>
                <MessageSquare className="h-4 w-4" />
                Negotiation coaching
                {coachingOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                Get negotiation coaching
              </>
            )}
          </button>

          {coachingError && (
            <p className="mt-2 text-xs text-red-600">{coachingError}</p>
          )}

          {coaching && coachingOpen && (
            <div className="mt-4 border border-purple-200 rounded-xl overflow-hidden">
              {/* Talking Points */}
              <div className="bg-purple-50 px-5 py-4 border-b border-purple-200">
                <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-3">
                  Your talking points
                </p>
                <ul className="space-y-2">
                  {coaching.talking_points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-purple-900">
                      <span className="flex-shrink-0 font-bold text-purple-500 mt-0.5">{i + 1}.</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Your Position */}
              <div className="px-5 py-4 border-b border-purple-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Your position
                </p>
                <p className="text-sm text-gray-800">{coaching.your_position}</p>
              </div>

              {/* Their Response + Counter */}
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-purple-100">
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Their likely response
                  </p>
                  <p className="text-sm text-gray-700">{coaching.their_likely_response}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Your counter
                  </p>
                  <p className="text-sm text-gray-700">{coaching.counter_argument}</p>
                </div>
              </div>

              {/* Opening Script */}
              <div className="bg-gray-900 px-5 py-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Opening script — copy &amp; send
                </p>
                <p className="text-sm text-gray-100 leading-relaxed italic">
                  &ldquo;{coaching.opening_script}&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
