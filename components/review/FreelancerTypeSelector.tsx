'use client'

import { FreelancerType } from '@/lib/types'

interface FreelancerTypeSelectorProps {
  value: FreelancerType | null
  onChange: (type: FreelancerType) => void
}

const TYPES: { value: FreelancerType; label: string; description: string }[] = [
  { value: 'developer', label: 'Developer', description: 'Software, apps, websites' },
  { value: 'designer', label: 'Designer', description: 'UI/UX, graphic, brand' },
  { value: 'marketer', label: 'Marketer', description: 'Ads, content, strategy' },
  { value: 'creative', label: 'Creative Director', description: 'Art direction, creative strategy' },
  { value: 'video', label: 'Video / Content', description: 'Film, editing, production' },
  { value: 'other', label: 'Other', description: 'Consulting, writing, etc.' },
]

export function FreelancerTypeSelector({ value, onChange }: FreelancerTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TYPES.map((type) => (
        <button
          key={type.value}
          type="button"
          onClick={() => onChange(type.value)}
          className={`relative flex flex-col items-start p-4 rounded-lg border-2 text-left transition-all ${
            value === type.value
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {value === type.value && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500" />
          )}
          <span className="font-medium text-gray-900 text-sm">{type.label}</span>
          <span className="text-xs text-gray-500 mt-0.5">{type.description}</span>
        </button>
      ))}
    </div>
  )
}
