/**
 * Badge Components
 *
 * Consistent status, priority, and due status badges.
 * All badges use the same base styling pattern:
 * - text-label (12px) for consistent typography
 * - h-6 (24px) fixed height
 * - px-2 consistent horizontal padding
 * - rounded-sm with subtle border
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

/** Normalize text to Title Case */
function toTitleCase(str: string): string {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const badgeBase = 'text-xs px-2 h-6 font-medium rounded-sm border'

/** Status badge with semantic color coding */
export const StatusBadge = memo(function StatusBadge({ status }: { status: string }) {
  const getStyle = (s: string) => {
    switch (s?.toUpperCase()) {
      case 'COMPLETED':
      case 'DONE':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30'
      case 'IN_PROGRESS':
      case 'ACTIVE':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30'
      case 'PENDING':
      case 'OPEN':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30'
      default:
        return 'bg-muted/50 text-muted-foreground border-border'
    }
  }

  return (
    <Badge
      variant="outline"
      className={cn(badgeBase, getStyle(status))}
    >
      {toTitleCase(status)}
    </Badge>
  )
})

StatusBadge.displayName = 'StatusBadge'

/** Priority badge with urgency color coding */
export const PriorityBadge = memo(function PriorityBadge({ priority }: { priority: string }) {
  const getStyle = (p: string) => {
    switch (p?.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 dark:border-red-500/30'
      case 'MEDIUM':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 dark:border-orange-500/30'
      case 'LOW':
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20 dark:border-slate-500/30'
      default:
        return 'bg-muted/50 text-muted-foreground border-border'
    }
  }

  return (
    <Badge
      variant="outline"
      className={cn(badgeBase, getStyle(priority))}
    >
      {toTitleCase(priority)}
    </Badge>
  )
})

PriorityBadge.displayName = 'PriorityBadge'

/** Due status badge with timeline color coding */
export const DueStatusBadge = memo(function DueStatusBadge({ dueStatus }: { dueStatus: string }) {
  const getStyle = (s: string) => {
    switch (s?.toUpperCase()) {
      case 'OVERDUE':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 dark:border-red-500/30'
      case 'TODAY':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30'
      case 'UPCOMING':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30'
      default:
        return 'bg-muted/50 text-muted-foreground border-border'
    }
  }

  return (
    <Badge
      variant="outline"
      className={cn(badgeBase, getStyle(dueStatus))}
    >
      {toTitleCase(dueStatus)}
    </Badge>
  )
})

DueStatusBadge.displayName = 'DueStatusBadge'
