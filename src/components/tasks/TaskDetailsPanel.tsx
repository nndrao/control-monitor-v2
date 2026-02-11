/**
 * TaskDetailsPanel Component
 *
 * Features:
 * - Contextual color bar at top encoding urgency at a glance
 * - Compact header with title, badges, metadata
 * - Unified scroll content area
 * - Persistent command bar at the bottom for quick actions
 */

import { cn } from '@/lib/utils'
import { useAppContext } from '@/contexts/AppContext'
import { getAgGridTheme } from '@/themes/agGridTheme'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  X,
  Maximize2,
  Minimize2,
  MessageSquare,
  Paperclip,
  Send,
  MoreHorizontal,
} from 'lucide-react'
import { PriorityBadge, DueStatusBadge } from '@/components/shared/badges'
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

/** Get urgency gradient based on due status */
function getUrgencyGradient(task: Task): string {
  switch (task.dueStatus?.toUpperCase()) {
    case 'OVERDUE':
      return 'bg-gradient-to-r from-red-500 via-red-500 to-red-600'
    case 'TODAY':
      return 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600'
    case 'UPCOMING':
      return 'bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600'
    case 'COMPLETED':
      return 'bg-gradient-to-r from-purple-500 via-purple-500 to-purple-600'
    default:
      return 'bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/20'
  }
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

/** Command bar action button */
function CommandButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-3 text-muted-foreground hover:text-foreground"
          onClick={onClick}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden desktop:inline text-xs">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-xs desktop:hidden">
        {label}
      </TooltipContent>
    </Tooltip>
  )
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
      {/* Contextual Color Bar — instant urgency signal */}
      <div className={cn('h-1 w-full flex-shrink-0', getUrgencyGradient(task))} />

      {/* Panel Header — 2 lines: title + metadata */}
      <div className="flex flex-col border-b border-border flex-shrink-0 bg-background px-4 py-2.5 gap-1">
        {/* Line 1: Title + badges + window controls */}
        <div className="flex items-center justify-between gap-2">
          <h2
            className="text-sm font-semibold text-foreground leading-snug truncate"
            title={task.title}
          >
            {task.title}
          </h2>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <PriorityBadge priority={task.priority} />
            {task.dueStatus && <DueStatusBadge dueStatus={task.dueStatus} />}
            {onToggleExpand && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
              >
                {isExpanded ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              aria-label="Close panel"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Line 2: Metadata */}
        <div className="flex items-center gap-x-1.5 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground/70">{task.controlName}</span>
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

      {/* Command Bar — persistent quick actions */}
      <div className="flex-shrink-0 border-t border-border bg-muted/20 px-3 py-1.5">
        <div className="flex items-center gap-1">
          <CommandButton icon={MessageSquare} label="Note" />
          <CommandButton icon={Paperclip} label="Attach" />
          <CommandButton icon={Send} label="Assign" />
          <div className="flex-1" />
          <CommandButton icon={MoreHorizontal} label="More" />
        </div>
      </div>
    </div>
  )
}
