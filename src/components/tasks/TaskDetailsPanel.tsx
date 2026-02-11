/**
 * TaskDetailsPanel Component
 *
 * Master-detail panel container for task details with Notion-inspired design.
 * Shows a clean header with title, status badges, and metadata.
 * Below header: tab-based navigation for different content sections.
 * Supports expand/collapse functionality for responsive layout.
 */

import { cn } from '@/lib/utils'
import { useAppContext } from '@/contexts/AppContext'
import { getAgGridTheme } from '@/themes/agGridTheme'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import { StatusBadge, PriorityBadge, DueStatusBadge } from '@/components/shared/badges'
import { TaskDetailTabs } from './TaskDetailTabs'
import type { Task } from '@/hooks/useTaskData'
import type { TaskDetails } from '@/types/task-details.types'

interface TaskDetailsPanelProps {
  task: Task
  taskDetails: TaskDetails | null
  loading: boolean
  onClose: () => void
  isExpanded?: boolean
  onToggleExpand?: () => void
  className?: string
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function TaskDetailsPanel({
  task,
  taskDetails,
  loading,
  onClose,
  isExpanded = false,
  onToggleExpand,
  className,
}: TaskDetailsPanelProps) {
  const { theme } = useAppContext()
  const gridTheme = getAgGridTheme(theme)

  return (
    <div
      className={cn(
        'h-full flex flex-col bg-background border-l border-border',
        className
      )}
    >
      {/* Panel Header — clean visual hierarchy */}
      <div className="flex flex-col border-b border-border flex-shrink-0 bg-background">
        {/* Row 1: Title + window controls */}
        <div className="flex items-start justify-between gap-3 px-6 pt-4 pb-2">
          <div className="flex-1 min-w-0">
            <h2
              className="text-base font-semibold text-foreground leading-snug tracking-tight"
              title={task.title}
            >
              {task.title}
            </h2>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {onToggleExpand && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleExpand}
                className="text-muted-foreground hover:text-foreground"
                aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Row 2: Status badges — subtle, inline */}
        <div className="px-6 pb-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {task.dueStatus && <DueStatusBadge dueStatus={task.dueStatus} />}
        </div>

        {/* Row 3: Metadata — text-xs text-muted-foreground */}
        <div className="px-6 pb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="font-medium">{task.controlName}</span>
          <span className="text-border">·</span>
          <span>{task.controlType}</span>
          <span className="text-border">·</span>
          <span>Due {formatDate(task.dueDate)}</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ) : taskDetails ? (
        <div className="flex-1 min-h-0">
          <TaskDetailTabs
            task={task}
            taskDetails={taskDetails}
            instructions={taskDetails.controlInstructions}
            gridTheme={gridTheme}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Unable to load task details
          </p>
        </div>
      )}
    </div>
  )
}
