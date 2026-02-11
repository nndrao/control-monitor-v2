/**
 * Notion-Inspired KPI Card Component
 *
 * Clean, minimal card for displaying key performance indicators.
 * Features:
 * - Subtle left accent bar (4px) for visual hierarchy
 * - Consistent typography tokens
 * - Optional trend indicator with directional arrow
 * - Standardized hover-card pattern
 * - Dark mode support
 */

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  /** Card label/title */
  label: string
  /** Main KPI value to display */
  value: string | number
  /** Optional trend indicator */
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  /** Optional accent color for the left bar (e.g., 'emerald', 'blue', 'red') */
  accentColor?: 'emerald' | 'blue' | 'red' | 'amber' | 'purple' | 'slate'
  /** Additional CSS classes */
  className?: string
}

const accentColorMap: Record<string, string> = {
  emerald: 'border-l-emerald-500',
  blue: 'border-l-blue-500',
  red: 'border-l-red-500',
  amber: 'border-l-amber-500',
  purple: 'border-l-purple-500',
  slate: 'border-l-slate-500',
}

const trendColorMap = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-red-600 dark:text-red-400',
}

export function KPICard({
  label,
  value,
  trend,
  accentColor = 'slate',
  className,
}: KPICardProps) {
  const accentClass = accentColorMap[accentColor] || accentColorMap.slate
  const trendColor = trend && trendColorMap[trend.direction]

  return (
    <Card
      className={cn(
        'border-l-4 rounded-none rounded-r-lg hover-card',
        accentClass,
        className
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Label */}
        <div className="section-label">
          {label}
        </div>

        {/* Value and Trend */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold tabular-nums text-foreground">
            {value}
          </div>

          {trend && (
            <div className={cn('flex items-center gap-1 text-label font-medium', trendColor)}>
              {trend.direction === 'up' ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
