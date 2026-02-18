'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { FileText, Copy, Check, Loader2, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DemandLetterPage() {
  const supabase = createBrowserSupabaseClient()
  const [plan, setPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [letter, setLetter] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    freelancerName: '',
    clientName: '',
    projectName: '',
    projectDescription: '',
    amountOwed: '',
    paymentDueDate: '',
    pastDueDays: '',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('plan, freelancer_type')
        .eq('id', user.id)
        .single()
      setPlan(data?.plan || 'free')
      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLetter('')
    setGenerating(true)

    const response = await fetch('/api/demand-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        amountOwed: Number(form.amountOwed),
        pastDueDays: Number(form.pastDueDays),
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Failed to generate letter.')
    } else {
      setLetter(data.letter)
    }
    setGenerating(false)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  const isPro = plan === 'pro' || plan === 'agency'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Payment Demand Letter</h1>
        </div>
        <p className="text-sm text-gray-500">
          Generate a professional, legally assertive demand letter for overdue payments.
        </p>
      </div>

      {!isPro && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Lock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Pro feature</h2>
              <p className="text-sm text-gray-600 mb-4">
                Payment demand letters are available on the Pro plan ($59/month). Upgrade to unlock this tool plus negotiation coaching.
              </p>
              <Link
                href="/settings?upgrade=true"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Upgrade to Pro
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              name="freelancerName"
              required
              value={form.freelancerName}
              onChange={handleChange}
              disabled={!isPro}
              placeholder="Jane Smith"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Client name <span className="text-red-500">*</span>
            </label>
            <input
              name="clientName"
              required
              value={form.clientName}
              onChange={handleChange}
              disabled={!isPro}
              placeholder="Acme Corp"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Project name <span className="text-red-500">*</span>
          </label>
          <input
            name="projectName"
            required
            value={form.projectName}
            onChange={handleChange}
            disabled={!isPro}
            placeholder="Website Redesign"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Project description
          </label>
          <textarea
            name="projectDescription"
            rows={3}
            value={form.projectDescription}
            onChange={handleChange}
            disabled={!isPro}
            placeholder="Brief description of what you delivered..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Amount owed ($) <span className="text-red-500">*</span>
            </label>
            <input
              name="amountOwed"
              type="number"
              required
              min="1"
              value={form.amountOwed}
              onChange={handleChange}
              disabled={!isPro}
              placeholder="2500"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Original due date <span className="text-red-500">*</span>
            </label>
            <input
              name="paymentDueDate"
              type="date"
              required
              value={form.paymentDueDate}
              onChange={handleChange}
              disabled={!isPro}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Days past due
            </label>
            <input
              name="pastDueDays"
              type="number"
              min="0"
              value={form.pastDueDays}
              onChange={handleChange}
              disabled={!isPro}
              placeholder="14"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!isPro || generating}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating letter...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Generate demand letter
            </>
          )}
        </button>
      </form>

      {letter && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Your demand letter</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy to clipboard
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-mono">
              {letter}
            </pre>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Review this letter before sending. FreelanceShield is not a law firm and this is not legal advice.
          </p>
        </div>
      )}
    </div>
  )
}
