import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Preprocess contract text before sending to Claude
export function preprocessContractText(text: string): string {
  const originalLength = text.length
  console.log(`[preprocess] Original text length: ${originalLength} chars`)

  // Strip excessive whitespace
  let cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]{3,}/g, '  ')
    .trim()

  // Truncate if over 80,000 characters
  if (cleaned.length > 80000) {
    cleaned = cleaned.slice(0, 80000)
    console.log(`[preprocess] Truncated to 80,000 chars from ${originalLength}`)
  }

  return cleaned
}

// Format risk score label
export function getRiskLabel(score: number): string {
  if (score <= 3) return 'Low Risk'
  if (score <= 6) return 'Medium Risk'
  return 'High Risk'
}

// Get color class for risk score
export function getRiskScoreColor(score: number): string {
  if (score <= 3) return 'text-green-600'
  if (score <= 6) return 'text-yellow-600'
  return 'text-red-600'
}

export function getRiskScoreRingColor(score: number): string {
  if (score <= 3) return 'stroke-green-500'
  if (score <= 6) return 'stroke-yellow-500'
  return 'stroke-red-500'
}

export function getRiskLevelColor(level: string): string {
  switch (level) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low': return 'bg-green-100 text-green-800 border-green-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Format freelancer type for display
export function formatFreelancerType(type: string): string {
  const map: Record<string, string> = {
    developer: 'Developer',
    designer: 'Designer',
    marketer: 'Marketer',
    creative: 'Creative Director',
    video: 'Video/Content',
    other: 'Other',
  }
  return map[type] || type
}

// Check if plan allows full access
export function canAccessFullReport(plan: string): boolean {
  return ['solo', 'pro', 'agency'].includes(plan)
}
