export type FreelancerType = 'developer' | 'designer' | 'marketer' | 'creative' | 'video' | 'other'
export type Plan = 'free' | 'solo' | 'pro' | 'agency'
export type RiskLevel = 'low' | 'medium' | 'high'
export type ReviewStatus = 'pending' | 'processing' | 'complete' | 'error'
export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  freelancer_type: FreelancerType | null
  us_state: string | null
  plan: Plan
  role: UserRole
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  reviews_used_this_month: number
  reviews_reset_date: string
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  file_name: string | null
  raw_text: string | null
  freelancer_type: string | null
  us_state: string | null
  overall_risk_score: number | null
  risk_summary: string | null
  status: ReviewStatus
  error_message: string | null
  share_token: string | null
  created_at: string
  clauses?: Clause[]
}

export interface NegotiationCoaching {
  talking_points: string[]
  your_position: string
  their_likely_response: string
  counter_argument: string
  opening_script: string
}

export interface Clause {
  id: string
  review_id: string
  clause_type: string
  original_text: string | null
  risk_level: RiskLevel
  plain_english: string | null
  specific_concern: string | null
  suggested_edit: string | null
  sort_order: number | null
  created_at: string
}

export interface Template {
  id: string
  name: string
  description: string | null
  freelancer_type: FreelancerType | null
  us_state: string | null
  content: string
  is_active: boolean
  created_at: string
}

export interface Escalation {
  id: string
  review_id: string | null
  user_id: string | null
  attorney_id: string | null
  status: 'pending' | 'assigned' | 'in_review' | 'complete'
  amount_paid: number | null
  notes: string | null
  created_at: string
}

// Claude API response types
export interface AnalysisResult {
  is_contract: boolean
  overall_risk_score: number
  risk_summary: string
  clauses: AnalysisClause[]
}

export interface AnalysisClause {
  clause_type: string
  original_text: string
  risk_level: RiskLevel
  plain_english: string
  specific_concern: string
  suggested_edit: string
  sort_order: number
}

// Plan limits
export const PLAN_LIMITS: Record<Plan, { reviews_per_month: number; full_clauses: boolean; suggested_edits: boolean; templates: number }> = {
  free: { reviews_per_month: 1, full_clauses: false, suggested_edits: false, templates: 0 },
  solo: { reviews_per_month: Infinity, full_clauses: true, suggested_edits: true, templates: 3 },
  pro: { reviews_per_month: Infinity, full_clauses: true, suggested_edits: true, templates: 10 },
  agency: { reviews_per_month: Infinity, full_clauses: true, suggested_edits: true, templates: 999 },
}

export const FREE_CLAUSE_LIMIT = 3

export const US_STATES = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'alaska', label: 'Alaska' },
  { value: 'arizona', label: 'Arizona' },
  { value: 'arkansas', label: 'Arkansas' },
  { value: 'california', label: 'California' },
  { value: 'colorado', label: 'Colorado' },
  { value: 'connecticut', label: 'Connecticut' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'florida', label: 'Florida' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'hawaii', label: 'Hawaii' },
  { value: 'idaho', label: 'Idaho' },
  { value: 'illinois', label: 'Illinois' },
  { value: 'indiana', label: 'Indiana' },
  { value: 'iowa', label: 'Iowa' },
  { value: 'kansas', label: 'Kansas' },
  { value: 'kentucky', label: 'Kentucky' },
  { value: 'louisiana', label: 'Louisiana' },
  { value: 'maine', label: 'Maine' },
  { value: 'maryland', label: 'Maryland' },
  { value: 'massachusetts', label: 'Massachusetts' },
  { value: 'michigan', label: 'Michigan' },
  { value: 'minnesota', label: 'Minnesota' },
  { value: 'mississippi', label: 'Mississippi' },
  { value: 'missouri', label: 'Missouri' },
  { value: 'montana', label: 'Montana' },
  { value: 'nebraska', label: 'Nebraska' },
  { value: 'nevada', label: 'Nevada' },
  { value: 'new_hampshire', label: 'New Hampshire' },
  { value: 'new_jersey', label: 'New Jersey' },
  { value: 'new_mexico', label: 'New Mexico' },
  { value: 'new_york', label: 'New York' },
  { value: 'north_carolina', label: 'North Carolina' },
  { value: 'north_dakota', label: 'North Dakota' },
  { value: 'ohio', label: 'Ohio' },
  { value: 'oklahoma', label: 'Oklahoma' },
  { value: 'oregon', label: 'Oregon' },
  { value: 'pennsylvania', label: 'Pennsylvania' },
  { value: 'rhode_island', label: 'Rhode Island' },
  { value: 'south_carolina', label: 'South Carolina' },
  { value: 'south_dakota', label: 'South Dakota' },
  { value: 'tennessee', label: 'Tennessee' },
  { value: 'texas', label: 'Texas' },
  { value: 'utah', label: 'Utah' },
  { value: 'vermont', label: 'Vermont' },
  { value: 'virginia', label: 'Virginia' },
  { value: 'washington', label: 'Washington' },
  { value: 'west_virginia', label: 'West Virginia' },
  { value: 'wisconsin', label: 'Wisconsin' },
  { value: 'wyoming', label: 'Wyoming' },
  { value: 'district_of_columbia', label: 'District of Columbia' },
]
