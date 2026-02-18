export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none text-gray-700 space-y-6">
        <p className="text-lg text-gray-600">Effective date: February 2026</p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">What we collect</h2>
          <p>FreelanceShield collects your email address, freelancer type, and US state when you create an account. We collect the text content of contracts you upload for the purpose of analysis.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">How we use your data</h2>
          <p>Your contract text is sent to the Anthropic API for AI analysis. No contract text is shared with any other third party, other users, or used for model training. Your data is stored securely in our Supabase database with row-level security enabled.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">Data security</h2>
          <p>Contract files are stored in private Supabase Storage buckets accessible only via signed URLs with 1-hour expiry. All database tables are protected by Row Level Security — users can only access their own data.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
          <p>For privacy questions, contact us at privacy@freelanceshield.com.</p>
        </section>
      </div>
    </div>
  )
}
