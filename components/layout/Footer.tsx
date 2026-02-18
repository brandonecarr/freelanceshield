import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900 text-sm">FreelanceShield</span>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-700">Terms</Link>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed" style={{ fontSize: '12px' }}>
            FreelanceShield is a software tool that explains contract language. It is not a law firm and does not provide legal advice. Nothing in this analysis creates an attorney-client relationship. For contracts involving significant financial value or complex legal issues, consult a licensed attorney.
          </p>
        </div>
      </div>
    </footer>
  )
}
