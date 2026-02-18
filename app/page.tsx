import Link from 'next/link'
import { Shield, Upload, Search, FileText, CheckCircle, ArrowRight, Star } from 'lucide-react'

const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Try it before you commit',
    features: [
      '1 contract review per month',
      'Top 3 risk clauses identified',
      'Plain-English explanations',
      'Risk score (1–10)',
    ],
    cta: 'Get started free',
    href: '/auth/signup',
    highlighted: false,
  },
  {
    name: 'Solo',
    price: '$29',
    period: '/month',
    description: 'For active freelancers',
    features: [
      'Unlimited contract reviews',
      'Full clause analysis',
      'Suggested replacement language',
      'State-specific legal rules',
      '3 contract templates',
      'Review history vault',
    ],
    cta: 'Start Solo plan',
    href: '/auth/signup',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$59',
    period: '/month',
    description: 'For power negotiators',
    features: [
      'Everything in Solo',
      'AI negotiation coaching',
      'Payment demand letters',
      '10 contract templates',
    ],
    cta: 'Start Pro plan',
    href: '/auth/signup',
    highlighted: false,
  },
]

const FAQ_ITEMS = [
  {
    q: 'Is this real legal advice?',
    a: 'No. FreelanceShield is a software tool that explains what contract language means. It catches 90% of the common issues freelancers encounter, but it\'s not a substitute for a licensed attorney on complex matters.',
  },
  {
    q: 'What types of contracts can I upload?',
    a: 'Service agreements, NDAs, freelance contracts, consulting agreements, licensing agreements — any standard client contract. We support text-based PDFs up to 10MB.',
  },
  {
    q: 'How accurate is the analysis?',
    a: 'The AI is powered by Claude, one of the most capable AI models for document analysis. It\'s trained to identify specific clause types and flag issues based on your freelancer type and state. Accuracy improves as we refine the system.',
  },
  {
    q: 'Is my contract data private?',
    a: 'Yes. Your contract text is only sent to the Anthropic API for analysis and stored securely in your account database. We never share your contract data with third parties or other users.',
  },
]

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Shield className="h-3.5 w-3.5" />
            AI-powered contract protection for freelancers
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Stop signing contracts
            <br />
            <span className="text-blue-600">you don&apos;t understand</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your client contract and get plain-English explanations of every risky clause, suggested replacement language, and state-specific legal flags — in under 60 seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Review your first contract free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required · 1 free review per month</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="text-gray-500 mt-2">Three steps between you and a clear-eyed contract review</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Upload your contract',
                description: 'Drop your PDF client contract. We accept any standard service agreement, NDA, or freelance contract.',
              },
              {
                step: '02',
                icon: Search,
                title: 'AI finds the risks',
                description: 'Our AI scans every clause across 10 categories — IP ownership, payment terms, non-competes, liability, and more.',
              },
              {
                step: '03',
                icon: FileText,
                title: 'Get plain-English answers',
                description: 'Every risky clause explained in plain English with specific concerns called out and suggested replacement language ready to paste.',
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 mb-4">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <div className="text-xs font-bold text-blue-500 tracking-widest mb-1">{step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we catch */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What we catch</h2>
            <p className="text-gray-500 mt-2">The 10 clause categories that can cost freelancers thousands</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'IP Ownership & Work For Hire', desc: 'Does this contract steal your future work?' },
              { title: 'Payment Terms & Kill Fees', desc: 'What happens if they cancel without notice?' },
              { title: 'Scope & Revision Limits', desc: 'Unlimited revisions is a trap.' },
              { title: 'Non-Compete & Non-Solicitation', desc: 'Can you still work in your industry?' },
              { title: 'Termination Rights', desc: 'Who can kill the contract and when?' },
              { title: 'Liability & Indemnification', desc: 'Are you on the hook for their mistakes?' },
              { title: 'Governing Law & Disputes', desc: 'Where do you have to sue if things go wrong?' },
              { title: 'Confidentiality & NDA', desc: 'How long can they gag you?' },
              { title: 'Exclusivity', desc: 'Are you blocked from taking other clients?' },
              { title: 'Automatic Renewal', desc: 'Are you locked in after the project ends?' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              <span>Join our beta — real freelancer stories coming soon</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { name: 'Alex M.', type: 'Frontend Developer', quote: 'Caught a "work for hire" clause that would have given the client ownership of a library I built on my own time. Saved me from a $40k mistake.' },
              { name: 'Sarah K.', type: 'Brand Designer', quote: 'The unlimited revisions flag was a game changer. I sent the suggested edit back and the client agreed without any pushback.' },
              { name: 'Jordan T.', type: 'Marketing Consultant', quote: 'Found a non-solicitation clause that would have blocked me from working with anyone in their industry for 2 years. Almost signed it.' },
            ].map(({ name, type, quote }) => (
              <div key={name} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                  <p className="text-gray-500 text-xs">{type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Simple pricing</h2>
            <p className="text-gray-500 mt-2">No contracts. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border-2 flex flex-col ${
                  plan.highlighted
                    ? 'border-blue-500 bg-white shadow-xl shadow-blue-100'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
                    Most popular
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-lg font-bold text-gray-900">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-2.5 px-4 rounded-xl font-medium text-sm transition-colors ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your next contract is waiting
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Start for free. Know what you&apos;re signing.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-blue-50 transition-colors"
          >
            Review your first contract free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
