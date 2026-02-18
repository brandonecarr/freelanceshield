import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const TEMPLATES: Record<string, { name: string; content: string }> = {
  'freelance-services-agreement': {
    name: 'Freelance Services Agreement',
    content: `FREELANCE SERVICES AGREEMENT

This Freelance Services Agreement ("Agreement") is entered into as of [DATE] between:

Freelancer: [YOUR FULL NAME], an independent contractor ("Freelancer")
Client:     [CLIENT FULL NAME / COMPANY NAME] ("Client")

1. SERVICES
Freelancer agrees to perform the following services ("Services"):
[DESCRIBE PROJECT IN DETAIL — e.g., "Design and develop a 5-page marketing website including home, about, services, portfolio, and contact pages."]

Freelancer will deliver:
[LIST DELIVERABLES]

2. TIMELINE
Work will commence on [START DATE] and is expected to be completed by [END DATE], subject to timely receipt of materials, feedback, and approvals from Client. Any delay caused by Client's failure to provide timely responses (more than 3 business days) will extend the timeline by an equivalent period, with no penalty to Freelancer.

3. COMPENSATION
Client agrees to pay Freelancer:
  - Total project fee: $[AMOUNT]
  - Payment schedule:
      50% deposit due upon signing this Agreement
      50% due upon delivery of final deliverables

Payment is due within [5] business days of each milestone. Freelancer reserves the right to pause or suspend work if payment is more than 7 days late.

Late payments accrue interest at 1.5% per month (18% per year) on the outstanding balance.

4. CHANGE ORDERS
Any requests for work outside the scope of Section 1 ("Change Orders") must be submitted in writing. Freelancer will provide a written estimate for the additional work. No additional work will begin until a Change Order is signed by both parties.

5. INTELLECTUAL PROPERTY
Upon receipt of full payment, Freelancer assigns to Client all rights, title, and interest in the final delivered work product ("Final Work"). Freelancer retains all rights to:
  (a) Pre-existing materials, tools, code libraries, frameworks, and templates ("Pre-Existing Work") incorporated into the Final Work, for which Client receives a non-exclusive license to use as part of the Final Work;
  (b) General skills, knowledge, and methodologies developed during the engagement.

Freelancer retains the right to display the Final Work in their portfolio and marketing materials.

6. REVISIONS
The project fee includes [NUMBER] round(s) of revisions per deliverable. Revision requests must be submitted in writing within [5] business days of delivery. Additional revisions will be billed at Freelancer's standard hourly rate of $[RATE]/hour.

7. INDEPENDENT CONTRACTOR
Freelancer is an independent contractor, not an employee of Client. Freelancer is responsible for their own taxes, insurance, and equipment. This Agreement does not create a joint venture, partnership, or agency relationship.

8. CONFIDENTIALITY
Each party agrees to keep the other's non-public business information confidential and not to disclose it to third parties without prior written consent, except as required by law. This obligation survives termination of this Agreement for 2 years.

9. NON-SOLICITATION
Client agrees not to solicit, hire, or engage any employee, subcontractor, or team member introduced to Client through this engagement for a period of 12 months after termination.

10. LIMITATION OF LIABILITY
In no event shall either party be liable for indirect, incidental, special, consequential, or punitive damages. Freelancer's total liability under this Agreement shall not exceed the total fees paid by Client in the 3 months preceding the claim.

11. TERMINATION
Either party may terminate this Agreement with [14] days written notice. Upon termination:
  - Client owes payment for all work completed through the termination date;
  - If Client terminates without cause, the deposit is non-refundable;
  - Freelancer will deliver all completed work to Client upon receipt of final payment.

12. DISPUTE RESOLUTION
The parties agree to attempt to resolve disputes through good-faith negotiation before pursuing other remedies. This Agreement is governed by the laws of [FREELANCER'S STATE]. Any legal action must be brought in [FREELANCER'S COUNTY, STATE].

13. ENTIRE AGREEMENT
This Agreement constitutes the entire understanding between the parties and supersedes all prior negotiations, representations, or agreements.

SIGNATURES

Freelancer: _________________________  Date: __________
[YOUR NAME]

Client:     _________________________  Date: __________
[CLIENT NAME / AUTHORIZED REPRESENTATIVE]
`,
  },

  'nda-mutual': {
    name: 'Mutual Non-Disclosure Agreement',
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of [DATE] between:

Party A: [YOUR FULL NAME / COMPANY NAME]
Party B: [CLIENT FULL NAME / COMPANY NAME]

(collectively, the "Parties," and individually, a "Party")

PURPOSE
The Parties wish to explore a potential business relationship (the "Purpose") and, in connection with that exploration, may disclose to each other certain confidential and proprietary information.

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by one Party (the "Disclosing Party") to the other (the "Receiving Party"), whether orally, in writing, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure.

Confidential Information does NOT include information that:
  (a) is or becomes publicly known through no breach of this Agreement;
  (b) was rightfully known by the Receiving Party before disclosure;
  (c) is received from a third party without restriction;
  (d) was independently developed by the Receiving Party without use of the Confidential Information;
  (e) is required to be disclosed by law, court order, or regulatory authority, provided the Receiving Party gives the Disclosing Party prompt written notice and cooperates with efforts to seek a protective order.

2. OBLIGATIONS
Each Receiving Party agrees to:
  (a) keep the Confidential Information strictly confidential;
  (b) not disclose Confidential Information to any third party without prior written consent of the Disclosing Party;
  (c) use the Confidential Information solely for the Purpose;
  (d) limit access to the Confidential Information to its employees, contractors, and agents who have a need-to-know and are bound by confidentiality obligations at least as protective as this Agreement;
  (e) protect the Confidential Information using the same degree of care it uses for its own confidential information, but no less than reasonable care.

3. TERM
This Agreement is effective as of the date above and will remain in force for [2] years, unless earlier terminated in writing by mutual agreement. The obligations regarding Confidential Information disclosed during the term will survive for [3] years after the termination of this Agreement.

4. RETURN OR DESTRUCTION
Upon request by the Disclosing Party or upon termination of this Agreement, the Receiving Party will promptly return or destroy all Confidential Information and any copies, extracts, or summaries thereof, and will certify such destruction in writing upon request.

5. NO LICENSE
Nothing in this Agreement grants either Party any license or right to use the other Party's Confidential Information except as expressly set forth herein.

6. NO WARRANTY
Confidential Information is provided "as is." Neither Party makes any warranty, express or implied, regarding the accuracy or completeness of the Confidential Information.

7. REMEDIES
Each Party acknowledges that any breach of this Agreement may cause irreparable harm for which monetary damages would be inadequate, and therefore agrees that the Disclosing Party shall be entitled to seek equitable relief, including injunction, without requirement of a bond, in addition to all other remedies.

8. GOVERNING LAW
This Agreement shall be governed by the laws of [FREELANCER'S STATE], without regard to conflict of law principles. Any disputes shall be resolved in [FREELANCER'S COUNTY, STATE].

9. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the Parties regarding its subject matter and supersedes all prior agreements, representations, or understandings.

SIGNATURES

Party A: _________________________  Date: __________
[YOUR NAME]

Party B: _________________________  Date: __________
[CLIENT NAME / AUTHORIZED REPRESENTATIVE]
`,
  },

  'web-development-contract': {
    name: 'Web Development Contract',
    content: `WEB DEVELOPMENT CONTRACT

This Web Development Contract ("Agreement") is entered into as of [DATE] between:

Developer: [YOUR FULL NAME], an independent contractor ("Developer")
Client:    [CLIENT FULL NAME / COMPANY NAME] ("Client")

1. PROJECT SCOPE
Developer agrees to design and develop the following ("Project"):
[DESCRIBE PROJECT — e.g., "A responsive marketing website consisting of the following pages: Home, About, Services, Portfolio, Blog, Contact."]

Deliverables include:
[LIST ALL DELIVERABLES — e.g., "Fully functional website deployed to Client's hosting environment, source code repository access, README with deployment instructions."]

OUT OF SCOPE: The following are not included unless added via Change Order (Section 5): SEO optimization beyond basic meta tags, ongoing maintenance, content writing, third-party API integrations not listed above, hosting setup.

2. TIMELINE
  - Project Start: [START DATE]
  - Estimated Completion: [END DATE]
  - Milestone 1 (Design mockups): [DATE]
  - Milestone 2 (Frontend build): [DATE]
  - Milestone 3 (Testing & delivery): [DATE]

All timelines assume Client provides required materials (copy, images, credentials) within 3 business days of request. Client review periods of more than 3 business days will extend the timeline accordingly.

3. COMPENSATION
  - Total project fee: $[AMOUNT]
  - Payment schedule:
      50% ($[AMOUNT]) due upon signing — work begins upon receipt
      25% ($[AMOUNT]) due upon Milestone 2 completion
      25% ($[AMOUNT]) due upon final delivery and Client's acceptance

Late payments (beyond 5 business days) accrue interest at 1.5%/month. Developer may pause work for unpaid invoices.

4. INTELLECTUAL PROPERTY
4.1 DEVELOPER-OWNED PRE-EXISTING WORK. Developer retains all rights in pre-existing code, libraries, frameworks, templates, plugins, and tools ("Developer IP"). Client receives a non-exclusive, non-transferable license to use Developer IP solely as part of the delivered Project.

4.2 THIRD-PARTY COMPONENTS. The Project may incorporate open-source components subject to their respective licenses (e.g., MIT, Apache 2.0). Developer will provide a list of such components upon delivery.

4.3 CLIENT WORK. Upon receipt of full payment, Developer assigns to Client all rights in the custom code and design created specifically for this Project ("Custom Work"), excluding Developer IP and third-party components.

4.4 PORTFOLIO. Developer retains the right to display the Project in their portfolio and marketing materials.

5. CHANGE ORDERS
Requests to add, modify, or remove features outside the scope in Section 1 must be submitted in writing. Developer will provide a written estimate within 3 business days. Work on changes does not begin until both parties sign a written Change Order with agreed scope and additional fee.

6. REVISIONS
The project fee includes [2] rounds of design revisions per deliverable. Revision requests must be submitted in writing within [5] business days of delivery. Additional revision rounds are billed at $[RATE]/hour with 2-hour minimum.

7. CLIENT RESPONSIBILITIES
Client agrees to:
  (a) Provide all content (copy, images, brand assets) by [DATE] or within 5 business days of request;
  (b) Designate a single point of contact for approvals;
  (c) Provide timely feedback within 3 business days of each deliverable.

Failure to fulfill these responsibilities may delay the project at no fault of Developer.

8. HOSTING & DEPLOYMENT
Developer will deploy the Project to [CLIENT'S HOSTING ENVIRONMENT — e.g., Vercel / AWS / Client's cPanel]. Client is responsible for all hosting fees, domain registration, and SSL certificates. Developer's deployment responsibilities end upon successful delivery.

9. TESTING & ACCEPTANCE
Developer will provide a staging URL for Client review. Client has [5] business days to accept or provide written feedback on deliverables. Silence after 5 business days constitutes acceptance. Post-acceptance bug fixes are provided for [30] days at no charge; new features require a Change Order.

10. CONFIDENTIALITY
Each party agrees to keep the other's non-public business information confidential. Developer agrees to keep Client's source code, business data, and credentials confidential. This obligation survives termination for 2 years.

11. INDEPENDENT CONTRACTOR
Developer is an independent contractor. Nothing in this Agreement creates an employment, partnership, or joint venture relationship. Developer is responsible for their own taxes, benefits, and equipment.

12. LIMITATION OF LIABILITY
Developer's total liability shall not exceed fees paid in the 3 months preceding the claim. Neither party is liable for indirect, consequential, or punitive damages. Developer is not liable for security breaches caused by Client's failure to maintain secure credentials or update software post-delivery.

13. TERMINATION
Either party may terminate with 14 days written notice. Upon termination, Client pays for all completed work. Deposit is non-refundable if Client terminates without cause. Developer delivers all completed work upon receipt of final payment.

14. GOVERNING LAW
This Agreement is governed by the laws of [DEVELOPER'S STATE]. Disputes shall be resolved in [DEVELOPER'S COUNTY, STATE].

SIGNATURES

Developer: _________________________  Date: __________
[YOUR NAME]

Client:    _________________________  Date: __________
[CLIENT NAME / AUTHORIZED REPRESENTATIVE]
`,
  },

  'design-services-contract': {
    name: 'Design Services Contract',
    content: `DESIGN SERVICES CONTRACT

This Design Services Contract ("Agreement") is entered into as of [DATE] between:

Designer: [YOUR FULL NAME], an independent contractor ("Designer")
Client:   [CLIENT FULL NAME / COMPANY NAME] ("Client")

1. SERVICES & DELIVERABLES
Designer agrees to provide the following design services ("Services"):
[DESCRIBE PROJECT — e.g., "Brand identity design including logo, color palette, typography system, and brand guidelines."]

Deliverables ("Deliverables"):
[LIST DELIVERABLES WITH FORMATS — e.g., "Logo in SVG, PNG (transparent background), and PDF formats; Brand guidelines PDF; Source files in Adobe Illustrator .ai format."]

Deliverables do NOT include: raw files, working files, or source files unless explicitly listed above.

2. TIMELINE
  - Project Start: [START DATE]
  - Initial Concepts Delivery: [DATE]
  - Final Delivery: [DATE]

Timeline assumes Client provides all materials (brand assets, inspiration, brief) within 3 business days of signing. Each round of revisions extends the timeline by [3] business days.

3. COMPENSATION
  - Total project fee: $[AMOUNT]
  - Payment schedule:
      50% ($[AMOUNT]) non-refundable deposit due upon signing
      50% ($[AMOUNT]) due upon final delivery

Late payments accrue interest at 1.5%/month. Designer may pause work for overdue invoices.

4. REVISIONS
This project fee includes:
  - [2] rounds of concept revisions per deliverable

A "revision round" means one consolidated set of feedback per deliverable. Revision requests must be submitted in writing within [5] business days of delivery. Revisions requested verbally or outside the included rounds will be billed at $[RATE]/hour.

IMPORTANT: Major changes in project direction, scope, or creative brief after design work has begun constitute a new project and will be quoted separately.

5. INTELLECTUAL PROPERTY
5.1 UPON FULL PAYMENT. Designer assigns to Client all rights in the final approved Deliverables ("Final Work") upon receipt of full payment.

5.2 CONCEPTS & UNUSED WORK. All preliminary concepts, drafts, mockups, and rejected designs ("Unused Work") remain the property of Designer and may not be used by Client.

5.3 DESIGNER IP. Designer retains all rights in pre-existing design elements, textures, patterns, and templates incorporated in the work. Client receives a license to use such elements as part of the Final Work only.

5.4 STOCK ASSETS. If the project uses licensed stock images, fonts, or icons, Client is responsible for obtaining the appropriate licenses for their specific use case. Designer will provide a list of assets used.

5.5 PORTFOLIO. Designer retains the right to display the Final Work in their portfolio and marketing materials.

5.6 CREDIT. Designer requests credit where reasonable ("Design by [YOUR NAME / HANDLE]").

6. FONT & ASSET LICENSING
Designer selects fonts and assets appropriate for the project. Client must purchase appropriate commercial licenses for any fonts or assets delivered in the Final Work if Client intends to use them beyond the scope described herein.

7. CLIENT-PROVIDED MATERIALS
Client represents that it owns or has rights to all materials (logos, images, content) provided to Designer. Client agrees to indemnify Designer against any claims arising from Client-provided materials.

8. PRINT & PRODUCTION
Designer is not responsible for color accuracy differences between screen display and physical print reproduction. Client is responsible for reviewing and approving all proofs before print production.

9. CONFIDENTIALITY
Both parties agree to keep the other's non-public information confidential. Designer will not disclose Client's business information. This obligation survives for 2 years after termination.

10. INDEPENDENT CONTRACTOR
Designer is an independent contractor, not an employee of Client. Designer is responsible for their own taxes, equipment, and professional expenses.

11. LIMITATION OF LIABILITY
Designer's total liability shall not exceed fees paid under this Agreement. Designer is not liable for indirect, consequential, or punitive damages, including lost profits or revenue.

12. TERMINATION
Either party may terminate with 14 days written notice. Upon termination, Client pays for all work completed. Deposit is non-refundable. Designer retains all work until final payment is received.

13. GOVERNING LAW
This Agreement is governed by the laws of [DESIGNER'S STATE]. Disputes shall be resolved in [DESIGNER'S COUNTY, STATE].

SIGNATURES

Designer: _________________________  Date: __________
[YOUR NAME]

Client:   _________________________  Date: __________
[CLIENT NAME / AUTHORIZED REPRESENTATIVE]
`,
  },

  'video-production-agreement': {
    name: 'Video Production Agreement',
    content: `VIDEO PRODUCTION AGREEMENT

This Video Production Agreement ("Agreement") is entered into as of [DATE] between:

Producer: [YOUR FULL NAME / PRODUCTION COMPANY NAME] ("Producer")
Client:   [CLIENT FULL NAME / COMPANY NAME] ("Client")

1. PROJECT DESCRIPTION
Producer agrees to create the following video content ("Project"):
[DESCRIBE PROJECT — e.g., "One 60-90 second brand video for use on Client's website and social media channels, based on the approved creative brief dated [DATE]."]

Deliverables:
[LIST DELIVERABLES WITH SPECS — e.g., "Finished video in H.264 MP4 format at 1920x1080 (16:9), color graded and mixed to -14 LUFS; 1 vertical crop at 1080x1920 for social media."]

2. TIMELINE
  - Pre-production / script approval: [DATE]
  - Production (shooting): [DATE(S)]
  - First cut delivered: [DATE]
  - Final delivery: [DATE]

Timelines assume Client provides feedback within [3] business days of each delivery. Delays in feedback extend all subsequent deadlines accordingly.

3. COMPENSATION
  - Total project fee: $[AMOUNT]
  - Payment schedule:
      50% ($[AMOUNT]) non-refundable deposit due upon signing — production begins upon receipt
      50% ($[AMOUNT]) due upon delivery of final approved video

All licensing fees, music sync licenses, talent fees, location fees, and equipment rentals are [INCLUDED / BILLED SEPARATELY — choose one].

Late payments accrue interest at 1.5%/month.

4. USAGE RIGHTS & LICENSING
4.1 GRANT OF LICENSE. Upon receipt of full payment, Producer grants Client a [non-exclusive / exclusive — choose one], [worldwide / United States only — choose one] license to use the delivered video for:
  [LIST APPROVED USES — e.g., "Client's website, organic social media posts, and internal presentations."]

4.2 EXCLUDED USES. The following uses are NOT included and require a separate license agreement and additional fee:
  - Paid advertising (pre-roll, social ads, broadcast, out-of-home)
  - Resale or redistribution to third parties
  - Use beyond [1 / 2 / 3] year(s) from delivery date

4.3 OWNERSHIP. Producer retains copyright ownership of all raw footage, B-roll, audio, and creative elements. Only the license described in 4.1 is granted. Client does not receive ownership of the copyright.

4.4 RAW FOOTAGE. Raw, unedited footage is not included in this Agreement. Access to raw footage may be licensed for an additional fee of $[AMOUNT].

4.5 PORTFOLIO. Producer retains the right to display the finished video in their portfolio and marketing materials.

5. REVISIONS
This fee includes:
  - [2] rounds of editorial revisions after first cut delivery

A revision round is one consolidated set of notes submitted in writing within [3] business days of each delivery. Revisions beyond the included rounds are billed at $[RATE]/hour with a 2-hour minimum.

Revisions do NOT include reshoots. Reshoots due to changes in creative direction are quoted separately.

6. MUSIC & THIRD-PARTY CONTENT
If Producer sources licensed music, stock footage, or sound effects, Producer will provide documentation of licenses. Client is responsible for obtaining any additional licenses required for uses outside the scope in Section 4.1 (e.g., broadcast, paid advertising).

7. CLIENT RESPONSIBILITIES
Client agrees to:
  (a) Provide written creative brief and all brand assets by [DATE];
  (b) Designate one point of contact with authority to approve;
  (c) Provide access to filming locations if applicable;
  (d) Obtain any permits or releases required for Client-designated filming locations.

8. TALENT & RELEASE FORMS
Producer will obtain signed release forms from all talent appearing in the video. Client is responsible for notifying Producer of any talent who are Client's own employees.

9. FORCE MAJEURE
Neither party is liable for delays caused by circumstances beyond reasonable control (weather, illness, equipment failure). Both parties agree to reschedule in good faith.

10. CONFIDENTIALITY
Both parties agree to keep the other's non-public business information confidential for 2 years following termination.

11. INDEPENDENT CONTRACTOR
Producer is an independent contractor. Nothing in this Agreement creates an employment relationship.

12. LIMITATION OF LIABILITY
Producer's total liability shall not exceed fees paid under this Agreement. Producer is not liable for indirect, consequential, or punitive damages.

13. TERMINATION
Either party may terminate with 14 days written notice. Client pays for all work completed through the termination date. The deposit is non-refundable if Client terminates without cause.

14. GOVERNING LAW
This Agreement is governed by the laws of [PRODUCER'S STATE]. Disputes shall be resolved in [PRODUCER'S COUNTY, STATE].

SIGNATURES

Producer: _________________________  Date: __________
[YOUR NAME / COMPANY]

Client:   _________________________  Date: __________
[CLIENT NAME / AUTHORIZED REPRESENTATIVE]
`,
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify authentication
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify Solo+ plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const hasAccess = ['solo', 'pro', 'agency'].includes(profile?.plan || '')
  if (!hasAccess) {
    return NextResponse.json({ error: 'Solo plan required' }, { status: 403 })
  }

  const template = TEMPLATES[params.id]
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  const { generateTemplatePDF } = await import('@/lib/pdf-generator')
  const pdfBuffer = await generateTemplatePDF(template.name, template.content)
  const slug = template.name.replace(/\s+/g, '-').toLowerCase()

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${slug}.pdf"`,
    },
  })
}
