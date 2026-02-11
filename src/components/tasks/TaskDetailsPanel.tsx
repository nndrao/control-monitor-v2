/**
 * TaskDetailsPanel Component
 *
 * Consistent padding across all header rows (px-5).
 * Slide-in animation via parent container.
 * Standardized icon button sizes (h-7 w-7).
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
      {/* Panel Header — consistent px-5 py-3 across all rows */}
      <div className="flex flex-col border-b border-border flex-shrink-0 bg-background">
        {/* Row 1: Title + window controls */}
        <div className="flex items-start justify-between gap-3 px-5 pt-3 pb-2">
          <div className="flex-1 min-w-0">
            <h2
              className="text-subhead font-semibold text-foreground leading-snug tracking-tight"
              title={task.title}
            >
              {task.title}
            </h2>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {onToggleExpand && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
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
              size="sm"
              onClick={onClose}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Row 2: Status badges */}
        <div className="px-5 pb-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {task.dueStatus && <DueStatusBadge dueStatus={task.dueStatus} />}
        </div>

        {/* Row 3: Metadata */}
        <div className="px-5 pb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-label text-muted-foreground">
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
            <Skeleton className="h-4 w-2/3" />
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
          <p className="text-body text-muted-foreground">
            Unable to load task details
          </p>
        </div>
      )}
    </div>
  )
}
