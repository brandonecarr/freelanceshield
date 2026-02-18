'use client'

import { useState } from 'react'
import { FreelancerType, US_STATES } from '@/lib/types'
import { FreelancerTypeSelector } from './review/FreelancerTypeSelector'
import { Shield } from 'lucide-react'

interface OnboardingModalProps {
  onComplete: (type: FreelancerType, state: string) => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [freelancerType, setFreelancerType] = useState<FreelancerType | null>(null)
  const [usState, setUsState] = useState('')

  function handleNext() {
    if (step === 1 && freelancerType) {
      setStep(2)
    }
  }

  function handleComplete() {
    if (freelancerType && usState) {
      onComplete(freelancerType, usState)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="p-6 pb-0 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? 'What type of freelancer are you?' : 'What state are you based in?'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {step === 1
              ? 'We use this to tailor the contract analysis to your specific work type.'
              : 'Contract law varies significantly by state. This helps us flag state-specific issues.'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 justify-center mt-4">
          <span className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <span className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        </div>

        <div className="p-6">
          {step === 1 ? (
            <>
              <FreelancerTypeSelector value={freelancerType} onChange={setFreelancerType} />
              <button
                onClick={handleNext}
                disabled={!freelancerType}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <select
                value={usState}
                onChange={(e) => setUsState(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select your state...</option>
                {US_STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!usState}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Start reviewing contracts
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
