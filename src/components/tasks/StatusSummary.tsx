/**
 * StatusSummary Component
 *
 * Notion-style status summary bar showing task counts by due status.
 * Displays soft-colored chips with icons and counts.
 */

import { useMemo } from 'react'
import { AlertCircle, Clock, ArrowUpRight, CheckCircle2, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/hooks/useTaskData'

interface StatusSummaryProps {
  tasks: Task[]
}

export function StatusSummary({ tasks }: StatusSummaryProps) {
  // Calculate task counts by due status
  const taskCounts = useMemo(() => {
    const counts = { all: tasks.length, overdue: 0, today: 0, upcoming: 0, completed: 0 }
    tasks.forEach((task) => {
      switch (task.dueStatus?.toUpperCase()) {
        case 'OVERDUE': counts.overdue++; break
        case 'TODAY': counts.today++; break
        case 'UPCOMING': counts.upcoming++; break
        case 'COMPLETED': counts.completed++; break
      }
    })
    return counts
  }, [tasks])

  return (
    <div className="bg-card/50 px-4 py-2 flex-shrink-0 border-b border-border/50">
      <div className="flex items-center gap-2 overflow-x-auto">
        {/* Total */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md',
          'bg-muted/30 border border-border/50'
        )}>
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {taskCounts.all}
          </span>
        </div>

        <div className="w-px h-5 bg-border/30" />

        {/* Overdue */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md',
          'bg-red-500/10 border border-red-200/50 dark:border-red-500/20'
        )}>
          <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
          <span className="text-xs text-red-600 dark:text-red-400">Outstanding</span>
          <span className="text-sm font-semibold tabular-nums text-red-700 dark:text-red-400">
            {taskCounts.overdue}
          </span>
        </div>

        {/* Today */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md',
          'bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20'
        )}>
          <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span className="text-xs text-amber-600 dark:text-amber-400">Due Today</span>
          <span className="text-sm font-semibold tabular-nums text-amber-700 dark:text-amber-400">
            {taskCounts.today}
          </span>
        </div>

        {/* Upcoming */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md',
          'bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20'
        )}>
          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs text-emerald-600 dark:text-emerald-400">Upcoming</span>
          <span className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
            {taskCounts.upcoming}
          </span>
        </div>

        {/* Completed */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md',
          'bg-purple-500/10 border border-purple-200/50 dark:border-purple-500/20'
        )}>
          <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          <span className="text-xs text-purple-600 dark:text-purple-400">Completed</span>
          <span className="text-sm font-semibold tabular-nums text-purple-700 dark:text-purple-400">
            {taskCounts.completed}
          </span>
        </div>
      </div>
    </div>
  )
}
