/**
 * StatusChips Component
 *
 * Interactive status filter chips for the page header.
 * Clicking a chip filters the grid by that due status.
 * Uses consistent typography tokens and responsive layout.
 */

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Task } from '@/hooks/useTaskData'

interface StatusChipsProps {
  tasks: Task[]
  /** Currently active filter (null = show all) */
  activeFilter?: string | null
  /** Callback when a chip is clicked */
  onFilterClick?: (filter: string | null) => void
}

export function StatusChips({ tasks, activeFilter = null, onFilterClick }: StatusChipsProps) {
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
    { key: null, label: 'Total', count: counts.all, dot: 'bg-foreground/40', text: 'text-foreground', activeBg: 'bg-foreground/10' },
    { key: 'OVERDUE', label: 'Outstanding', count: counts.overdue, dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400', activeBg: 'bg-red-500/10' },
    { key: 'TODAY', label: 'Today', count: counts.today, dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', activeBg: 'bg-amber-500/10' },
    { key: 'UPCOMING', label: 'Upcoming', count: counts.upcoming, dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', activeBg: 'bg-emerald-500/10' },
    { key: 'COMPLETED', label: 'Completed', count: counts.completed, dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', activeBg: 'bg-purple-500/10' },
  ]

  const handleClick = (key: string | null) => {
    if (!onFilterClick) return
    // Toggle off if clicking the same filter
    onFilterClick(activeFilter === key ? null : key)
  }

  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin">
      {chips.map((chip) => {
        const isActive = activeFilter === chip.key
        return (
          <button
            key={chip.label}
            onClick={() => handleClick(chip.key)}
            className={cn(
              'flex items-center gap-1.5 h-6 px-2 rounded-md transition-all duration-150 whitespace-nowrap',
              onFilterClick && 'cursor-pointer hover:bg-muted/50',
              !onFilterClick && 'cursor-default',
              isActive && chip.activeBg
            )}
          >
            <div className={cn('w-2 h-2 rounded-full flex-shrink-0', chip.dot)} />
            <span className="text-label text-muted-foreground font-medium">{chip.label}</span>
            <span className={cn('text-label font-bold tabular-nums', chip.text)}>
              {chip.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
