'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function ReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[review] Error:', error)
  }, [error])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Couldn&apos;t load this review</h2>
      <p className="text-sm text-gray-500 mb-6">The review may not exist or you don&apos;t have access to it.</p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
