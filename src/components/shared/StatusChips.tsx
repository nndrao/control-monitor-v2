/**
 * StatusChips Component
 *
 * Compact inline status count chips designed to sit inside a header bar.
 * Shows colored dot + label + count for each due status category.
 * All chips use a uniform height and font size for visual consistency.
 */

import { useMemo } from 'react'
import type { Task } from '@/hooks/useTaskData'

interface StatusChipsProps {
  tasks: Task[]
}

export function StatusChips({ tasks }: StatusChipsProps) {
  const counts = useMemo(() => {
    const c = { all: tasks.length, overdue: 0, today: 0, upcoming: 0, completed: 0 }
    tasks.forEach((task) => {
      switch (task.dueStatus?.toUpperCase()) {
        case 'OVERDUE': c.overdue++; break
        case 'TODAY': c.today++; break
        case 'UPCOMING': c.upcoming++; break
        case 'COMPLETED': c.completed++; break
      }
    })
    return c
  }, [tasks])

  const chips = [
    { label: 'Total', count: counts.all, dot: 'bg-foreground/40', text: 'text-foreground' },
    { label: 'Outstanding', count: counts.overdue, dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
    { label: 'Today', count: counts.today, dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    { label: 'Upcoming', count: counts.upcoming, dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Completed', count: counts.completed, dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
  ]

  return (
    <div className="flex items-center gap-4">
      {chips.map((chip) => (
        <div key={chip.label} className="flex items-center gap-1.5 h-6">
          <div className={`w-2 h-2 rounded-full ${chip.dot}`} />
          <span className="text-[11px] text-muted-foreground font-medium">{chip.label}</span>
          <span className={`text-[11px] font-bold tabular-nums ${chip.text}`}>
            {chip.count}
          </span>
        </div>
      ))}
    </div>
  )
}
