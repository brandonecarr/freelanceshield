export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <div className="prose prose-gray max-w-none text-gray-700 space-y-6">
        <p className="text-lg text-gray-600">Effective date: February 2026</p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="font-semibold text-amber-900">Important legal disclaimer</p>
          <p className="text-amber-800 mt-1">
            FreelanceShield is a software tool that explains contract language. It is not a law firm and does not provide legal advice. Nothing in this analysis creates an attorney-client relationship. For contracts involving significant financial value or complex legal issues, consult a licensed attorney.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Service description</h2>
          <p>FreelanceShield provides AI-powered contract analysis for freelancers. The service identifies and explains contract clauses and suggests alternative language. This is not legal advice.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Acceptable use</h2>
          <p>You may only upload contracts for which you are a party or have authorization to review. You may not upload contracts on behalf of others without their consent. You may not use the service for any illegal purpose.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Subscriptions and payments</h2>
          <p>Paid subscriptions are billed monthly. You may cancel at any time. Cancellation takes effect at the end of the current billing period. No refunds are provided for partial months.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Limitation of liability</h2>
          <p>FreelanceShield is provided &quot;as is&quot; without warranty. We are not liable for any damages arising from your use of the service or reliance on any analysis. The service is a tool, not a substitute for professional legal counsel.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Contact</h2>
          <p>For questions, contact us at legal@freelanceshield.com.</p>
        </section>
      </div>
    </div>
  )
}
