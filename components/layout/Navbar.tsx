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
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-lg">FreelanceShield</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-sm text-purple-700 font-medium hover:text-purple-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Templates
                </Link>
                <Link href="/settings" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Link
                  href="/review/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Review Contract
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Get started free
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2 py-2 text-sm text-purple-700 font-medium" onClick={() => setMobileOpen(false)}>
                    <ShieldCheck className="h-4 w-4" /> Admin
                  </Link>
                )}
                <Link href="/dashboard" className="flex items-center gap-2 py-2 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link href="/review/new" className="flex items-center gap-2 py-2 text-sm text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>
                  Review Contract
                </Link>
                <Link href="/templates" className="flex items-center gap-2 py-2 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                  <FileText className="h-4 w-4" /> Templates
                </Link>
                <Link href="/settings" className="flex items-center gap-2 py-2 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <button onClick={handleSignOut} className="flex items-center gap-2 py-2 text-sm text-gray-500 w-full text-left">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
                <Link href="/auth/signup" className="block py-2 text-sm text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>
                  Get started free
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
