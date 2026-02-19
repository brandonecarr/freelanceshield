import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <div className="px-4 sm:px-6 pb-6 bg-white">
      <footer className="bg-[#111111] rounded-3xl px-10 py-10 text-white">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-white text-sm">FreelanceShield</span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed">
              The AI-powered contract protection standard for independent freelancers.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">Product</p>
              <ul className="space-y-3">
                <li><Link href="/#pricing" className="text-sm text-neutral-500 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/templates" className="text-sm text-neutral-500 hover:text-white transition-colors">Templates</Link></li>
                <li><Link href="/review/new" className="text-sm text-neutral-500 hover:text-white transition-colors">Review Contract</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">Company</p>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-sm text-neutral-500 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-neutral-500 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} FreelanceShield. All rights reserved.
          </p>
          <p className="text-xs text-neutral-700 leading-relaxed max-w-lg">
            FreelanceShield is a software tool, not a law firm. Nothing here constitutes legal advice or creates an attorney-client relationship.
          </p>
        </div>
      </footer>
    </div>
  )
}
