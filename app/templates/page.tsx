import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { FileText, Download, Lock } from 'lucide-react'

const TEMPLATES = [
  {
    id: 'freelance-services-agreement',
    name: 'Freelance Services Agreement',
    description: 'A comprehensive general-purpose service agreement for any freelance work. Balanced and freelancer-protective.',
    freelancer_type: null,
    tags: ['General', 'Services'],
    plan_required: 'solo',
  },
  {
    id: 'nda-mutual',
    name: 'Mutual NDA',
    description: 'A mutual non-disclosure agreement that protects both parties. Includes carve-outs for publicly known information.',
    freelancer_type: null,
    tags: ['NDA', 'General'],
    plan_required: 'solo',
  },
  {
    id: 'web-development-contract',
    name: 'Web Development Contract',
    description: 'Tailored for developers. Includes IP ownership with carve-outs for pre-existing code, milestone payments, and scope change order process.',
    freelancer_type: 'developer',
    tags: ['Developer', 'Web'],
    plan_required: 'solo',
  },
  {
    id: 'design-services-contract',
    name: 'Design Services Contract',
    description: 'Built for designers. Limits revisions explicitly, protects unused concepts, and defines deliverable formats precisely.',
    freelancer_type: 'designer',
    tags: ['Designer', 'Creative'],
    plan_required: 'solo',
  },
  {
    id: 'video-production-agreement',
    name: 'Video Production Agreement',
    description: 'For video producers and editors. Distinguishes licensing from ownership, defines usage rights clearly.',
    freelancer_type: 'video',
    tags: ['Video', 'Creative'],
    plan_required: 'solo',
  },
]

export default async function TemplatesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan || 'free'
  const hasAccess = ['solo', 'pro', 'agency'].includes(plan)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Templates</h1>
          <p className="text-gray-500 text-sm mt-1">
            Freelancer-protective templates you can use as a starting point
          </p>
        </div>
      </div>

      {!hasAccess && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex items-start gap-3">
          <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900 text-sm">Templates require a Solo plan or higher</p>
            <p className="text-blue-700 text-sm mt-0.5">
              Upgrade to access all templates and get unlimited contract reviews.{' '}
              <Link href="/settings?upgrade=true" className="font-semibold underline">Upgrade now</Link>
            </p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-gray-500" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{template.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-4">
              {template.description}
            </p>
            {hasAccess ? (
              <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                <Download className="h-3.5 w-3.5" />
                Download template
              </button>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-400 py-2 rounded-lg text-xs font-medium cursor-not-allowed"
                disabled
              >
                <Lock className="h-3.5 w-3.5" />
                Solo plan required
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
