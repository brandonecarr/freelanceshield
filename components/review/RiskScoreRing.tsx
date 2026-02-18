interface RiskScoreRingProps {
  score: number
  size?: number
}

export function RiskScoreRing({ score, size = 120 }: RiskScoreRingProps) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 10) * circumference
  const strokeDashoffset = circumference - progress

  const color =
    score <= 3 ? '#22c55e' : score <= 6 ? '#eab308' : '#ef4444'

  const label =
    score <= 3 ? 'Low Risk' : score <= 6 ? 'Medium Risk' : 'High Risk'

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={8}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-500">/10</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  )
}
