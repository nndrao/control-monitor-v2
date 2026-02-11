/**
 * OverviewTab Component
 *
 * Combined Instructions + Details view — the most content-rich tab.
 * Shows instructions, task details, people, timeline, classification, and alerts.
 * Notion-inspired with generous whitespace and clean typography.
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  StickyNote,
} from 'lucide-react'
import type { Task } from '@/hooks/useTaskData'
import type { TaskDetails, ControlInstruction } from '@/types/task-details.types'

interface OverviewTabProps {
  task: Task
  taskDetails: TaskDetails | null
  instructions: ControlInstruction
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

/**
 * Person Card Component
 */
const PersonCard = memo(function PersonCard({
  label,
  name,
}: {
  label: string
  name: string
}) {
  if (!name) return null

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-semibold text-accent-foreground flex-shrink-0">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
        <p className="text-xs font-medium text-foreground truncate" title={name}>
          {name}
        </p>
      </div>
    </div>
  )
})

/**
 * Detail Chip Component
 */
const DetailChip = memo(function DetailChip({
  label,
  value,
}: {
  label: string
  value: string
}) {
  if (!value) return null

  return (
    <div className="rounded-md bg-muted/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-sm text-foreground font-medium truncate" title={value}>
        {value}
      </p>
    </div>
  )
})

export const OverviewTab = memo(function OverviewTab({
  task,
  instructions,
  className,
}: OverviewTabProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Details Section — shown first */}
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Details
        </p>

        {/* People Group */}
        {(task.assignedTo || task.responsibleEmployee) && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {task.assignedTo && (
                <PersonCard label="Assigned To" name={task.assignedTo} />
              )}
              {task.responsibleEmployee && (
                <PersonCard
                  label="Responsible"
                  name={task.responsibleEmployee}
                />
              )}
            </div>
          </div>
        )}

        {/* Timeline Group */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground font-medium">
                Due Date
              </p>
              <p
                className={cn(
                  'text-xs font-medium',
                  task.dueStatus === 'OVERDUE'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-foreground'
                )}
              >
                {formatDate(task.dueDate)}
                {task.daysOverdue != null && task.daysOverdue > 0 && (
                  <span className="ml-1.5 text-[10px] font-medium text-red-500 dark:text-red-400">
                    ({task.daysOverdue}d overdue)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground font-medium">
                Created
              </p>
              <p className="text-xs font-medium text-foreground">
                {formatDate(task.createdDate)}
              </p>
            </div>
          </div>

          {task.completedDate && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-medium">
                  Completed
                </p>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {formatDate(task.completedDate)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Classification Group */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <DetailChip label="Category" value={task.category} />
            <DetailChip label="Workflow Step" value={task.workflowStep} />
            <DetailChip label="Control Type" value={task.controlType} />
            {task.riskBunner && (
              <DetailChip label="Risk" value={task.riskBunner} />
            )}
          </div>
        </div>
      </div>

      {/* Alert Section */}
      {task.alertText && (
        <div className="flex items-start gap-2 rounded-md bg-amber-500/10 dark:bg-amber-500/5 p-3 border border-amber-500/20">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            {task.alertText}
          </p>
        </div>
      )}

      {/* Divider between Details and Instructions */}
      <hr className="border-t border-border" />

      {/* Instructions Section */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Control Instructions
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          {instructions.content}
        </p>

        {instructions.controlNote && (
          <div className="bg-muted/50 rounded-md p-3 mt-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {instructions.controlNote}
            </p>
          </div>
        )}

        {instructions.sections && instructions.sections.length > 0 && (
          <div className="space-y-3 mt-4">
            {instructions.sections.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {section.title}
                </h4>
                <ul className="space-y-1 pl-2">
                  {section.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1.5 text-[6px] flex-shrink-0">
                        ●
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Section */}
      {task.note && (
        <div className="flex items-start gap-2 rounded-md bg-muted/30 p-3 border border-border/50">
          <StickyNote className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {task.note}
          </p>
        </div>
      )}
    </div>
  )
})
