/**
 * Status Color Constants
 *
 * Single source of truth for all status-related colors used across the app.
 * Uses Tailwind semantic classes for light/dark mode consistency.
 */

/** Due status colors using Tailwind classes for theme compatibility */
export const DUE_STATUS_COLORS = {
  OVERDUE: {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10',
    dot: 'bg-red-500',
    badge: 'border-red-500/40 text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400',
    label: 'Outstanding',
  },
  TODAY: {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    dot: 'bg-amber-500',
    badge: 'border-amber-500/40 text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400',
    label: 'Due Today',
  },
  UPCOMING: {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-500',
    badge: 'border-emerald-500/40 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400',
    label: 'Upcoming',
  },
  COMPLETED: {
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10',
    dot: 'bg-purple-500',
    badge: 'border-purple-500/40 text-purple-700 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400',
    label: 'Completed',
  },
} as const

/** Task view configuration - single source of truth for navigation */
export const TASK_VIEWS = [
  { id: 'all', name: 'All Tasks', shortName: 'All Tasks' },
  { id: 'user-only', name: 'My Tasks (User Only)', shortName: 'My Tasks' },
  { id: 'pending-others', name: 'My Tasks (Pending Others)', shortName: 'Pending Others' },
  { id: 'watcher', name: 'My Watcher View', shortName: 'Watcher' },
  { id: 'rfi', name: 'My RFI Tasks', shortName: 'RFI Tasks' },
  { id: 'team', name: 'My Team Tasks', shortName: 'Team' },
  { id: 'extended-team', name: 'My Extended Team Tasks', shortName: 'Extended Team' },
  { id: 'delegated-out', name: 'My Tasks Delegated to Others', shortName: 'Delegated Out' },
  { id: 'delegated-in', name: 'Tasks Delegated To Me', shortName: 'Delegated In' },
  { id: 'profile', name: 'My Profile View', shortName: 'Profile' },
] as const

/** Get the display name for a task view by its route ID */
export function getViewName(viewId: string): string {
  return TASK_VIEWS.find(v => v.id === viewId)?.name ?? 'Tasks'
}

/** Get the short display name for a task view by its route ID */
export function getViewShortName(viewId: string): string {
  return TASK_VIEWS.find(v => v.id === viewId)?.shortName ?? 'Tasks'
}

export type DueStatusKey = keyof typeof DUE_STATUS_COLORS
