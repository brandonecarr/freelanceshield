'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { Shield, Menu, X, LogOut, Settings, LayoutDashboard, FileText, ShieldCheck } from 'lucide-react'

interface NavbarProps {
  user?: { email?: string } | null
  isAdmin?: boolean
}

export function Navbar({ user, isAdmin }: NavbarProps) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createBrowserSupabaseClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 bg-transparent pointer-events-none">
      {/* Floating pill */}
      <div className="max-w-5xl mx-auto bg-[#171717] rounded-full shadow-xl pointer-events-auto">
        <div className="flex h-12 items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Shield className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-semibold text-white">FreelanceShield</span>
          </Link>

          {/* Desktop center links */}
          <nav className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="px-3 py-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />Admin
                  </Link>
                )}
                <Link href="/dashboard" className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="h-3.5 w-3.5" />Dashboard
                </Link>
                <Link href="/templates" className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />Templates
                </Link>
                <Link href="/settings" className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5" />Settings
                </Link>
              </>
            ) : (
              <>
                <Link href="/#pricing" className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors">Pricing</Link>
                <Link href="/auth/login" className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors">Login</Link>
              </>
            )}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/review/new"
                  className="px-4 py-1.5 rounded-full bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors"
                >
                  Review Contract
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <Link
                href="/auth/signup"
                className="px-4 py-1.5 rounded-full bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors"
              >
                Try for free
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-neutral-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 border-t border-white/10 mt-1 pt-3 space-y-1">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2 py-2 text-xs text-purple-400" onClick={() => setMobileOpen(false)}>
                    <ShieldCheck className="h-4 w-4" />Admin
                  </Link>
                )}
                <Link href="/dashboard" className="flex items-center gap-2 py-2 text-xs text-neutral-300" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard className="h-4 w-4" />Dashboard
                </Link>
                <Link href="/review/new" className="flex items-center gap-2 py-2 text-xs text-orange-400 font-medium" onClick={() => setMobileOpen(false)}>
                  Review Contract
                </Link>
                <Link href="/templates" className="flex items-center gap-2 py-2 text-xs text-neutral-300" onClick={() => setMobileOpen(false)}>
                  <FileText className="h-4 w-4" />Templates
                </Link>
                <Link href="/settings" className="flex items-center gap-2 py-2 text-xs text-neutral-300" onClick={() => setMobileOpen(false)}>
                  <Settings className="h-4 w-4" />Settings
                </Link>
                <button onClick={handleSignOut} className="flex items-center gap-2 py-2 text-xs text-neutral-500 w-full">
                  <LogOut className="h-4 w-4" />Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/#pricing" className="block py-2 text-xs text-neutral-400" onClick={() => setMobileOpen(false)}>Pricing</Link>
                <Link href="/auth/login" className="block py-2 text-xs text-neutral-400" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/auth/signup" className="block py-2 text-xs text-orange-400 font-medium" onClick={() => setMobileOpen(false)}>Try for free</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
