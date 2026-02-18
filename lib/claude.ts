import Anthropic from '@anthropic-ai/sdk'
import { AnalysisResult, NegotiationCoaching } from './types'
import { preprocessContractText } from './utils'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildSystemPrompt(freelancerType: string, usState: string): string {
  return `You are a contract analysis engine for FreelanceShield, a legal tech tool for freelancers.
Your job is to analyze contracts and identify clauses that could harm the freelancer.

FREELANCER CONTEXT:
- Freelancer type: ${freelancerType}
- US State: ${usState}
- This freelancer is the SERVICE PROVIDER (contractor), not the client/buyer.

YOUR TASK:
Analyze the contract text below. Identify and evaluate every clause in these categories:
1. IP Ownership & Work For Hire
2. Payment Terms & Kill Fees
3. Scope of Work & Revision Limits
4. Non-Compete & Non-Solicitation
5. Termination Rights
6. Liability Cap & Indemnification
7. Governing Law & Dispute Resolution
8. Confidentiality & NDA Terms
9. Exclusivity
10. Automatic Renewal

For each clause you find, return a structured object. If a category has no relevant clause, omit it.

FREELANCER-TYPE SPECIFIC RULES:
- developer: Flag any clause that transfers IP including work done outside the engagement. California Labor Code 2870 carve-out is HIGHLY relevant. Watch for "work for hire" on software, which is legally ambiguous.
- designer: Flag unlimited revision clauses aggressively. Flag any clause giving client ownership of unused concepts/sketches.
- marketer: Flag non-solicitation terms that prevent working with competitors. Flag performance-based payment clauses where "performance" is undefined.
- creative: Flag exclusivity windows. Flag clauses preventing portfolio use.
- video: Flag licensing vs. ownership distinctions. Flag usage rights that are broader than the stated project.

STATE-SPECIFIC RULES:
- california: Non-competes are generally unenforceable. Note this when flagging non-compete clauses. Labor Code 2870 protects IP created on personal time.
- new_york: Non-competes are scrutinized for reasonableness. Flag any non-compete over 6 months.
- texas: Non-competes enforceable if reasonable in scope. Note when scope seems overbroad.
- florida: Non-competes are relatively enforceable. Flag any clause over 2 years.

RISK SCORING RUBRIC:
- high: Clause directly harms the freelancer's interests, transfers significant rights, or creates major financial exposure
- medium: Clause is unfavorable but negotiable or common in the industry; freelancer should be aware
- low: Clause is standard and acceptable; noting for completeness

IMPORTANT CONSTRAINTS:
- You are explaining what a contract says, NOT providing legal advice
- Never recommend a specific legal course of action
- If a clause is genuinely ambiguous or complex, flag it as requiring attorney review
- Only analyze what is actually in the contract text; do not invent clauses
- If the document does not appear to be a contract, return an error

OUTPUT FORMAT:
Return ONLY valid JSON. No preamble, no explanation outside the JSON, no markdown code blocks.

{
  "is_contract": true,
  "overall_risk_score": 7,
  "risk_summary": "One-sentence plain-English summary of the contract's overall risk to the freelancer",
  "clauses": [
    {
      "clause_type": "IP Ownership & Work For Hire",
      "original_text": "The exact text from the contract, verbatim, that this analysis is based on",
      "risk_level": "high",
      "plain_english": "Plain English explanation of what this clause actually means for the freelancer. Write as if explaining to a smart person with no legal background.",
      "specific_concern": "The specific reason this clause is problematic. Be concrete. Reference the exact problematic phrase.",
      "suggested_edit": "The exact replacement text the freelancer can paste into a reply. Write in contract language.",
      "sort_order": 1
    }
  ]
}`
}

export async function analyzeContract(
  contractText: string,
  freelancerType: string,
  usState: string
): Promise<AnalysisResult> {
  const processedText = preprocessContractText(contractText)
  const systemPrompt = buildSystemPrompt(freelancerType, usState)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Analyze this contract:\n\n${processedText}`,
      },
    ],
  })

  const rawText =
    response.content[0].type === 'text' ? response.content[0].text : ''

  // Strip any accidental markdown code fences
  const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim()

  try {
    const result = JSON.parse(cleaned) as AnalysisResult
    return result
  } catch {
    throw new Error(
      `Failed to parse Claude response: ${cleaned.slice(0, 200)}`
    )
  }
}

export async function generateNegotiationCoaching(
  clauseType: string,
  originalText: string,
  specificConcern: string,
  freelancerType: string,
  usState: string
): Promise<NegotiationCoaching> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: `You are a negotiation coach for freelancers. Help the freelancer negotiate a specific problematic contract clause.
The freelancer is a ${freelancerType} based in ${usState}.

Return ONLY valid JSON — no preamble, no markdown — with this exact structure:
{
  "talking_points": ["...", "..."],
  "your_position": "...",
  "their_likely_response": "...",
  "counter_argument": "...",
  "opening_script": "..."
}

- talking_points: 2-4 specific, factual points the freelancer can make about why this clause is unfair
- your_position: a clear, one-sentence statement of what to ask for instead
- their_likely_response: what the client will likely say when pushed back on (1-2 sentences)
- counter_argument: how to respond to the client's likely pushback (1-2 sentences)
- opening_script: the exact words the freelancer can say or email to open the negotiation. First person, professional but assertive. 2-4 sentences.`,
    messages: [
      {
        role: 'user',
        content: `Clause type: ${clauseType}\n\nOriginal contract language: "${originalText}"\n\nWhy this is a problem: ${specificConcern}\n\nHelp me negotiate this clause.`,
      },
    ],
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
  const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim()

  try {
    return JSON.parse(cleaned) as NegotiationCoaching
  } catch {
    throw new Error(`Failed to parse negotiation coaching: ${cleaned.slice(0, 200)}`)
  }
}

export async function generateDemandLetter(params: {
  clientName: string
  projectName: string
  amountOwed: number
  paymentDueDate: string
  projectDescription: string
  freelancerName: string
  usState: string
  pastDueDays: number
}): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: `You are a professional letter writer helping a freelancer draft a payment demand letter. Write a firm, professional, and legally assertive letter that:
- Clearly states the amount owed and the basis for it
- References the completed work and project
- Sets a firm payment deadline (7 business days from today)
- States consequences of non-payment (small claims court, collections, credit reporting)
- Is professional but leaves zero ambiguity about seriousness
- Is appropriate for the freelancer's US state

Return ONLY the letter text — no JSON, no markdown, no explanation. Start with the date line.`,
    messages: [
      {
        role: 'user',
        content: `Write a payment demand letter with these details:
- My name (freelancer): ${params.freelancerName}
- Client name: ${params.clientName}
- Project name: ${params.projectName}
- Project description: ${params.projectDescription}
- Amount owed: $${params.amountOwed}
- Original payment due date: ${params.paymentDueDate}
- Days past due: ${params.pastDueDays}
- My state: ${params.usState}`,
      },
    ],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}
