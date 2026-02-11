/**
 * SummaryCards Component
 *
 * Notion-style summary statistics cards for the metrics dashboard.
 * Each card has a colored left accent bar.
 * Responsive: 2-col on tablet, 4-col on desktop.
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
    <Card className="relative overflow-hidden hover-card rounded-md">
      {/* Colored left border */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${accentColor}`} />

      <div className="px-3 py-1.5 flex items-center justify-between gap-2">
        {/* Value */}
        <div className="text-lg font-bold text-foreground tracking-tight leading-none tabular-nums">
          {value}
        </div>

        {/* Label */}
        <div className="text-caption font-medium text-muted-foreground uppercase tracking-wide text-right leading-tight">
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
    <div className="grid grid-cols-2 tablet:grid-cols-4 gap-2">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  )
}
