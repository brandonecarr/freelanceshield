import { RiskLevel } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RiskBadgeProps {
  level: RiskLevel
  className?: string
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const styles = {
    high: 'bg-red-100 text-red-800 border border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    low: 'bg-green-100 text-green-800 border border-green-200',
  }

  const labels = {
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        styles[level],
        className
      )}
    >
      {labels[level]}
    </span>
  )
}
