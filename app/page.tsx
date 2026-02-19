import Link from 'next/link'
import { ArrowRight, Check, Star, Shield, AlertTriangle, Info } from 'lucide-react'

const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Perfect for individuals just starting out.',
    features: [
      '1 contract review per month',
      'Top 3 risk clauses',
      'Plain-English explanations',
      'Risk score (1–10)',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    highlighted: false,
  },
  {
    name: 'Solo',
    price: '$29',
    period: '/mo',
    description: 'For active freelancers who sign regularly.',
    features: [
      'Unlimited contract reviews',
      'Full clause analysis',
      'Suggested replacement language',
      'State-specific legal rules',
      '3 contract templates',
      'Review history vault',
    ],
    cta: 'Start Solo Plan',
    href: '/auth/signup',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$59',
    period: '/mo',
    description: 'For power negotiators and high-volume freelancers.',
    features: [
      'Everything in Solo',
      'AI negotiation coaching',
      'Payment demand letters',
      '10 contract templates',
    ],
    cta: 'Start Pro Plan',
    href: '/auth/signup',
    highlighted: false,
  },
]

const FAQ_ITEMS = [
  {
    q: 'Is this real legal advice?',
    a: "No. FreelanceShield is a software tool that explains what contract language means. It catches 90% of the common issues freelancers encounter, but it's not a substitute for a licensed attorney on complex matters.",
  },
  {
    q: 'What types of contracts can I upload?',
    a: 'Service agreements, NDAs, freelance contracts, consulting agreements, licensing agreements — any standard client contract. We support text-based PDFs up to 10MB.',
  },
  {
    q: 'How accurate is the analysis?',
    a: "Powered by Claude, one of the most capable AI models for document analysis. It's trained to identify specific clause types and flag issues based on your freelancer type and state.",
  },
  {
    q: 'Is my contract data private?',
    a: "Yes. Your contract text is only sent to the Anthropic API for analysis and stored securely in your account. We never share your contract data with third parties.",
  },
]

const CLAUSE_CATEGORIES = [
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
]

export default function LandingPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ marginTop: '-72px' }}>
        {/* Soft gradient background */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 10% 0%, #fde8d8 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 0%, #ede9fe 0%, transparent 60%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-[88px] pb-12 text-center">
          {/* Badge */}
          <div className="inline-block border border-gray-200 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-gray-500 mb-8">
            AI-Powered Contract Protection
          </div>

          {/* Headline */}
          <h1 className="font-bricolage font-semibold text-5xl sm:text-6xl lg:text-7xl text-gray-950 leading-[1.05] tracking-tight mb-6">
            Stop signing contracts<br />
            you{' '}
            <span className="text-orange-500">don&apos;t understand</span>
          </h1>

          {/* Subhead */}
          <p className="text-gray-500 text-xl leading-relaxed max-w-xl mx-auto mb-10">
            Upload your client contract and get plain-English explanations of every risky clause, suggested edits, and state-specific legal flags — in under 60 seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full px-7 py-3 text-base font-medium transition-colors shadow-lg shadow-orange-200"
            >
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 rounded-full px-7 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">No credit card required · 1 free review per month</p>
        </div>

        {/* Product mock */}
        <div className="relative max-w-3xl mx-auto px-6 pb-0">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-gray-400 font-mono">freelanceshield.com/review/…</span>
              <div className="w-16" />
            </div>
            {/* Report content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Contract Risk Analysis</p>
                  <h3 className="font-bricolage font-semibold text-lg text-gray-900">Web Design Service Agreement</h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bricolage font-semibold text-3xl text-orange-500">7.2</div>
                  <div className="text-xs text-gray-400">Risk Score</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { risk: 'high' as const, clause: 'IP Ownership & Work For Hire', text: 'All work product created during this engagement becomes sole property of Client including pre-existing IP…' },
                  { risk: 'medium' as const, clause: 'Non-Compete', text: 'Freelancer agrees not to work with competing companies or clients for 12 months after termination…' },
                  { risk: 'low' as const, clause: 'Payment Terms', text: 'Payment due within 30 days of invoice. Late payments subject to 1.5% monthly interest…' },
                ].map(({ risk, clause, text }) => (
                  <div key={clause} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="mt-0.5 flex-shrink-0">
                      {risk === 'high' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      {risk === 'medium' && <Info className="h-4 w-4 text-yellow-500" />}
                      {risk === 'low' && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{clause}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{text}</p>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      risk === 'high' ? 'bg-red-50 text-red-600' :
                      risk === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why FreelanceShield ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section label row */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 text-orange-500 text-xs uppercase tracking-widest font-medium">
              <span className="w-6 h-px bg-orange-500 block" />
              Why FreelanceShield?
            </div>
          </div>

          {/* Heading row */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <h2 className="font-bricolage font-semibold text-4xl sm:text-5xl text-gray-950 leading-tight">
              We believe freelancers deserve to know what they&apos;re signing.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed self-end">
              Buried clauses steal IP, block future work, and expose you to unlimited liability. FreelanceShield reads the fine print so you don&apos;t have to guess.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 — light, security */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-7 flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center mb-5">
                  <Shield className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="font-bricolage font-semibold text-xl text-gray-900 leading-snug">
                  Institutional-grade contract analysis.
                </h3>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  AI-powered scanning of every clause across 10 categories. Flags issues the average freelancer would miss.
                </p>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mt-6">Unrivaled Coverage</p>
            </div>

            {/* Card 2 — dark, stat */}
            <div className="bg-gray-950 rounded-3xl p-7 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(249,115,22,0.15), transparent)' }}
              />
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs px-3 py-1 mb-5">
                  Industry Data
                </div>
                <p className="font-bricolage font-semibold text-2xl text-white leading-snug">
                  The average freelancer loses{' '}
                  <span className="text-orange-400">$11,000</span>{' '}
                  to bad contract terms annually.
                </p>
              </div>
              <p className="relative text-xs uppercase tracking-widest text-neutral-600 mt-6">Real Consequences</p>
            </div>

            {/* Card 3 — light, stat */}
            <div className="bg-white border border-gray-100 rounded-3xl p-7 flex flex-col justify-between min-h-[260px]">
              <div>
                <p className="text-xs uppercase tracking-widest text-orange-500 mb-5">Risk Analysis</p>
                <p className="font-bricolage font-semibold text-5xl text-gray-950">10</p>
                <p className="text-gray-400 text-sm mt-1">clause categories</p>
                <p className="text-gray-500 text-sm mt-4 leading-relaxed">IP, payment, non-compete, liability, and more — all analyzed in under 60 seconds.</p>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mt-6">Comprehensive</p>
            </div>

            {/* Card 4 — dark, support */}
            <div className="bg-gray-950 rounded-3xl p-7 flex flex-col justify-between min-h-[260px]">
              <div className="flex items-start justify-between">
                <p className="text-orange-400 text-sm font-medium">Attorney Referral</p>
                <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-sm">⚖️</div>
              </div>
              <div>
                <p className="font-bricolage font-semibold text-2xl text-white leading-snug mt-6">
                  Humans in the loop, whenever you need them.
                </p>
                <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-600 uppercase tracking-wider">Freelancer-focused</span>
                    <span className="text-neutral-400">Pro plan</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-600 uppercase tracking-wider">Vetted attorneys</span>
                    <span className="text-neutral-400">On demand</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we analyze ───────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto border border-gray-100 rounded-3xl p-8 sm:p-12">
          {/* Header row */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 text-orange-500 text-xs uppercase tracking-widest font-medium mb-4">
                <span className="w-6 h-px bg-orange-500 block" />
                What We Analyze
              </div>
              <h2 className="font-bricolage font-semibold text-4xl text-gray-950 leading-tight max-w-lg">
                Everything you need to protect your freelance business
              </h2>
            </div>
            <p className="hidden lg:block text-gray-500 text-base leading-relaxed max-w-xs self-end">
              The 10 clause categories that can cost freelancers thousands — all scanned automatically.
            </p>
          </div>

          {/* Clause grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {CLAUSE_CATEGORIES.map(({ title, desc }) => (
              <div
                key={title}
                className="group border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 text-orange-500 text-xs uppercase tracking-widest font-medium">
              <span className="w-6 h-px bg-orange-500 block" />
              Testimonials
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-14">
            <h2 className="font-bricolage font-semibold text-4xl sm:text-5xl text-gray-950 leading-tight">
              Freelancers who caught what they almost signed.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed self-end">
              FreelanceShield is trusted by developers, designers, and consultants who sign contracts regularly. This is what they found.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Card 1 — light */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-7 flex flex-col">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed flex-1">
                &ldquo;Caught a &apos;work for hire&apos; clause that would have given the client ownership of a library I built on my own time. Saved me from a $40k mistake.&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">AM</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Alex M.</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Frontend Developer</p>
                </div>
              </div>
            </div>

            {/* Card 2 — orange (featured) */}
            <div className="bg-orange-500 rounded-3xl p-7 flex flex-col">
              <div className="w-9 h-9 rounded-2xl bg-orange-400 flex items-center justify-center text-white font-bold text-lg mb-5">&ldquo;</div>
              <p className="text-white text-sm leading-relaxed flex-1">
                &ldquo;The unlimited revisions flag was a game changer. I sent the suggested edit back to the client and they agreed without any pushback. Paid in full.&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-orange-400">
                <div className="w-9 h-9 rounded-full bg-orange-400 flex items-center justify-center text-xs font-semibold text-white">SK</div>
                <div>
                  <p className="text-sm font-semibold text-white">Sarah K.</p>
                  <p className="text-xs text-orange-200 uppercase tracking-wide">Brand Designer</p>
                </div>
              </div>
            </div>

            {/* Card 3 — light */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-7 flex flex-col">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed flex-1">
                &ldquo;Found a non-solicitation clause that would have blocked me from working with anyone in their industry for 2 years. Almost signed it without reading.&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">JT</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Jordan T.</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Marketing Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 text-orange-500 text-xs uppercase tracking-widest font-medium">
              <span className="w-6 h-px bg-orange-500 block" />
              Pricing
            </div>
            <Link href="#pricing" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Compare all plans →
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <h2 className="font-bricolage font-semibold text-4xl sm:text-5xl text-gray-950 leading-tight">
              Simple, transparent pricing that scales with your work.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed self-end">
              Choose the plan that fits your current workflow. FreelanceShield is built to support you from your first client to your hundredth contract.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {PRICING_PLANS.map((plan) =>
              plan.highlighted ? (
                /* Dark featured card */
                <div key={plan.name} className="bg-gray-950 rounded-3xl p-8 flex flex-col text-white">
                  <p className="font-bricolage font-semibold text-xl text-white">{plan.name}</p>
                  <p className="text-neutral-500 text-sm mt-1 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-7">
                    <span className="font-bricolage font-semibold text-5xl text-white">{plan.price}</span>
                    <span className="text-neutral-500 text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-300">
                        <Check className="h-4 w-4 text-orange-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className="block text-center bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3 text-sm font-medium transition-colors"
                  >
                    {plan.cta}
                  </Link>
                </div>
              ) : (
                /* Light card */
                <div key={plan.name} className="border border-gray-100 rounded-3xl p-8 flex flex-col bg-white hover:border-gray-200 transition-colors">
                  <p className="font-bricolage font-semibold text-xl text-gray-900">{plan.name}</p>
                  <p className="text-gray-400 text-sm mt-1 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-7">
                    <span className="font-bricolage font-semibold text-5xl text-gray-950">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className="block text-center border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-full py-3 text-sm font-medium transition-colors"
                  >
                    {plan.cta}
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-bricolage font-semibold text-4xl text-gray-950 text-center mb-14 leading-tight">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-gray-100">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="py-6">
                <h3 className="font-medium text-gray-900 mb-2">{q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-16 text-center"
            style={{
              background: 'radial-gradient(ellipse 80% 70% at 50% 100%, #fde8d8, transparent 70%), #f9fafb',
            }}
          >
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 text-orange-500 text-xs uppercase tracking-widest px-4 py-1.5 mb-6">
              Scale with FreelanceShield
            </div>
            <h2 className="font-bricolage font-semibold text-4xl sm:text-5xl text-gray-950 leading-tight mb-4 max-w-2xl mx-auto">
              Your next contract is waiting.
            </h2>
            <p className="text-gray-500 text-lg mb-10">
              Start for free. Know what you&apos;re signing.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white rounded-full px-7 py-3 text-base font-medium transition-colors"
              >
                Review your first contract free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 rounded-full px-7 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
              >
                Sign in →
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-gray-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-orange-400" />Enterprise Security</span>
              <span>·</span>
              <span>No card required</span>
              <span>·</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
