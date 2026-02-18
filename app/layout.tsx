import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FreelanceShield — AI Contract Review for Freelancers',
  description:
    'Upload your client contract and get plain-English explanations of risky clauses, suggested edits, and state-specific legal guidance. Built for independent freelancers.',
  keywords: 'contract review, freelancer, AI legal, contract analysis, work for hire, IP ownership',
  openGraph: {
    title: 'FreelanceShield — AI Contract Review for Freelancers',
    description: 'Stop signing contracts you don\'t understand. FreelanceShield finds the risky clauses and tells you exactly what to do.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <Navbar user={user} isAdmin={isAdmin} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
