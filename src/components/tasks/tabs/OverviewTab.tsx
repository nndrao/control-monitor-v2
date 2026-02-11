/**
 * OverviewTab Component
 *
 * Consistent typography tokens throughout:
 * - Section labels: section-label class (text-caption + uppercase tracking-wider)
 * - Sub-labels: text-caption
 * - Values: text-label
 * - Responsive grids: grid-cols-1 sm:grid-cols-2
 * - Collapsible sections via details/summary
 */

import { memo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  StickyNote,
  ChevronDown,
} from 'lucide-react'
import type { Task } from '@/hooks/useTaskData'
import type { TaskDetails, ControlInstruction } from '@/types/task-details.types'

interface OverviewTabProps {
  task: Task
  taskDetails: TaskDetails | null
  instructions: ControlInstruction
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

/** Collapsible section wrapper */
function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 w-full text-left group"
      >
        <ChevronDown
          className={cn(
            'h-3 w-3 text-muted-foreground transition-transform duration-150',
            !isOpen && '-rotate-90'
          )}
        />
        <span className="section-label">{title}</span>
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  )
}

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
      <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-caption font-semibold text-accent-foreground flex-shrink-0">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-caption text-muted-foreground font-medium">{label}</p>
        <p className="text-label font-medium text-foreground truncate" title={name}>
          {name}
        </p>
      </div>
    </div>
  )
})

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
      <p className="text-caption uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-body text-foreground font-medium truncate mt-0.5" title={value}>
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
    <div className={cn('space-y-5', className)}>
      {/* Details Section */}
      <CollapsibleSection title="Details" defaultOpen={true}>
        <div className="space-y-4">
          {/* People Group */}
          {(task.assignedTo || task.responsibleEmployee) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {task.assignedTo && (
                <PersonCard label="Assigned To" name={task.assignedTo} />
              )}
              {task.responsibleEmployee && (
                <PersonCard label="Responsible" name={task.responsibleEmployee} />
              )}
            </div>
          )}

          {/* Timeline Group */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-caption text-muted-foreground font-medium">Due Date</p>
                <p
                  className={cn(
                    'text-label font-medium',
                    task.dueStatus === 'OVERDUE'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-foreground'
                  )}
                >
                  {formatDate(task.dueDate)}
                  {task.daysOverdue != null && task.daysOverdue > 0 && (
                    <span className="ml-1.5 text-caption font-medium text-red-500 dark:text-red-400">
                      ({task.daysOverdue}d overdue)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-caption text-muted-foreground font-medium">Created</p>
                <p className="text-label font-medium text-foreground">
                  {formatDate(task.createdDate)}
                </p>
              </div>
            </div>

            {task.completedDate && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-caption text-muted-foreground font-medium">Completed</p>
                  <p className="text-label font-medium text-emerald-600 dark:text-emerald-400">
                    {formatDate(task.completedDate)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Classification Group — responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <DetailChip label="Category" value={task.category} />
            <DetailChip label="Workflow Step" value={task.workflowStep} />
            <DetailChip label="Control Type" value={task.controlType} />
            {task.riskBunner && (
              <DetailChip label="Risk" value={task.riskBunner} />
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Alert Section */}
      {task.alertText && (
        <div className="flex items-start gap-2 rounded-md bg-amber-500/10 dark:bg-amber-500/5 p-3 border border-amber-500/20">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-label text-amber-700 dark:text-amber-300 leading-relaxed">
            {task.alertText}
          </p>
        </div>
      )}

      {/* Divider */}
      <hr className="border-t border-border" />

      {/* Instructions Section — collapsible */}
      <CollapsibleSection title="Control Instructions" defaultOpen={true}>
        <div className="space-y-3">
          <p className="text-body text-foreground leading-relaxed">
            {instructions.content}
          </p>

          {instructions.controlNote && (
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-label text-muted-foreground leading-relaxed">
                {instructions.controlNote}
              </p>
            </div>
          )}

          {instructions.sections && instructions.sections.length > 0 && (
            <div className="space-y-3 mt-3">
              {instructions.sections.map((section, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h4 className="text-caption font-medium text-muted-foreground uppercase tracking-wide">
                    {section.title}
                  </h4>
                  <ul className="space-y-1 pl-2">
                    {section.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="text-label text-muted-foreground flex items-start gap-2"
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
      </CollapsibleSection>

      {/* Note Section */}
      {task.note && (
        <div className="flex items-start gap-2 rounded-md bg-muted/30 p-3 border border-border/50">
          <StickyNote className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-label text-muted-foreground leading-relaxed">
            {task.note}
          </p>
        </div>
      )}
    </div>
  )
})
