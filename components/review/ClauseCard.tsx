'use client'

import { useState } from 'react'
import { Clause } from '@/lib/types'
import { RiskBadge } from './RiskBadge'
import { Copy, Check, AlertTriangle } from 'lucide-react'

interface ClauseCardProps {
  clause: Clause
  showSuggestedEdit?: boolean
}

export function ClauseCard({ clause, showSuggestedEdit = true }: ClauseCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!clause.suggested_edit) return
    await navigator.clipboard.writeText(clause.suggested_edit)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
    </div>
  )
}
