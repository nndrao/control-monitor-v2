/**
 * SummaryCards Component
 *
 * Notion-style summary statistics cards for the metrics dashboard.
 * Each card has a colored left accent bar.
 */

import { Card } from '@/components/ui/card'
import type { MetricsSummaryStats } from '@/types/metrics'

interface SummaryCardsProps {
  stats: MetricsSummaryStats
}

interface StatCardProps {
  value: number | string
  label: string
  accentColor: string
}

const StatCard: React.FC<StatCardProps> = ({ value, label, accentColor }) => {
  return (
    <Card className="relative overflow-hidden bg-muted/20 border-border/40 hover:border-border/60 transition-colors duration-150 rounded-md">
      {/* Colored left border */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${accentColor}`} />

      <div className="pl-3 pr-2.5 py-1.5 flex items-center justify-between gap-2">
        {/* Value */}
        <div className="text-lg font-bold text-foreground tracking-tight leading-none tabular-nums">
          {value}
        </div>

        {/* Label */}
        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide text-right leading-tight">
          {label}
        </div>
      </div>
    </Card>
  )
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const cards = [
    {
      value: stats.totalRows,
      label: 'Employees',
      accentColor: 'bg-blue-500',
    },
    {
      value: stats.totalBreaches,
      label: 'Breaches',
      accentColor: 'bg-red-500',
    },
    {
      value: stats.totalPotentialBreaches,
      label: 'Potential',
      accentColor: 'bg-amber-500',
    },
    {
      value: stats.currentMonth,
      label: 'Period',
      accentColor: 'bg-emerald-500',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  )
}
