/**
 * OverviewTab — Redesigned with Floating Peek Cards
 *
 * Key info displayed in compact 2x2 card grid (People, Timeline, Classification).
 * Each card shows summary data at a glance — click to expand for details.
 * Instructions section kept as flowing text below the cards.
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
  Users,
  Tag,
  Timer,
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

/** Peek Card — compact summary that expands on click */
function PeekCard({
  icon: Icon,
  title,
  summary,
  children,
  accentColor = 'bg-muted',
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  summary: string
  children?: React.ReactNode
  accentColor?: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={cn(
        'w-full text-left rounded-lg border border-border/60 p-3 transition-all duration-150',
        'hover:border-border hover:bg-muted/20',
        expanded && 'bg-muted/10 border-border'
      )}
    >
      {/* Compact view */}
      <div className="flex items-start gap-2.5">
        <div className={cn('w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0', accentColor)}>
          <Icon className="h-3.5 w-3.5 text-foreground/70" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {title}
            </span>
            <ChevronDown
              className={cn(
                'h-3 w-3 text-muted-foreground transition-transform duration-150',
                expanded && 'rotate-180'
              )}
            />
          </div>
          <p className="text-xs font-medium text-foreground mt-0.5 truncate">
            {summary}
          </p>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && children && (
        <div className="mt-3 pt-3 border-t border-border/50">
          {children}
        </div>
      )}
    </button>
  )
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

function PersonRow({ label, name }: { label: string; name: string }) {
  if (!name) return null
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-[9px] font-semibold text-accent-foreground flex-shrink-0">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <p className="text-xs font-medium text-foreground truncate">{name}</p>
      </div>
    </div>
  )
}

export const OverviewTab = memo(function OverviewTab({
  task,
  instructions,
  className,
}: OverviewTabProps) {
  // Build summary strings for peek cards
  const peopleSummary = [task.assignedTo, task.responsibleEmployee]
    .filter(Boolean)
    .join(' & ') || 'Unassigned'

  const timelineSummary = task.daysOverdue != null && task.daysOverdue > 0
    ? `${task.daysOverdue}d overdue · Due ${formatDate(task.dueDate)}`
    : `Due ${formatDate(task.dueDate)}`

  const classificationSummary = [task.category, task.controlType]
    .filter(Boolean)
    .join(' · ') || 'Uncategorized'

  return (
    <div className={cn('space-y-4', className)}>
      {/* Peek Cards — 2x2 compact grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* People Card */}
        <PeekCard
          icon={Users}
          title="People"
          summary={peopleSummary}
          accentColor="bg-blue-500/10"
        >
          <div className="space-y-2.5">
            {task.assignedTo && (
              <PersonRow label="Assigned To" name={task.assignedTo} />
            )}
            {task.responsibleEmployee && (
              <PersonRow label="Responsible" name={task.responsibleEmployee} />
            )}
          </div>
        </PeekCard>

        {/* Timeline Card */}
        <PeekCard
          icon={Timer}
          title="Timeline"
          summary={timelineSummary}
          accentColor={task.daysOverdue && task.daysOverdue > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10'}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground">Due</span>
                <p className={cn(
                  'text-xs font-medium',
                  task.dueStatus === 'OVERDUE' ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                )}>
                  {formatDate(task.dueDate)}
                  {task.daysOverdue != null && task.daysOverdue > 0 && (
                    <span className="ml-1 text-[10px] text-red-500">({task.daysOverdue}d)</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground">Created</span>
                <p className="text-xs font-medium text-foreground">{formatDate(task.createdDate)}</p>
              </div>
            </div>
            {task.completedDate && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground">Completed</span>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{formatDate(task.completedDate)}</p>
                </div>
              </div>
            )}
          </div>
        </PeekCard>

        {/* Classification Card */}
        <PeekCard
          icon={Tag}
          title="Classification"
          summary={classificationSummary}
          accentColor="bg-purple-500/10"
        >
          <div className="flex flex-wrap gap-1.5">
            {task.category && (
              <span className="text-[10px] font-medium bg-muted/50 text-foreground px-2 py-0.5 rounded">
                {task.category}
              </span>
            )}
            {task.workflowStep && (
              <span className="text-[10px] font-medium bg-muted/50 text-foreground px-2 py-0.5 rounded">
                {task.workflowStep}
              </span>
            )}
            {task.controlType && (
              <span className="text-[10px] font-medium bg-muted/50 text-foreground px-2 py-0.5 rounded">
                {task.controlType}
              </span>
            )}
            {task.riskBunner && (
              <span className="text-[10px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
                {task.riskBunner}
              </span>
            )}
          </div>
        </PeekCard>

        {/* Alert Card — conditional, replaces the standalone alert box */}
        {task.alertText ? (
          <PeekCard
            icon={AlertTriangle}
            title="Alert"
            summary={task.alertText.length > 40 ? task.alertText.slice(0, 40) + '…' : task.alertText}
            accentColor="bg-amber-500/10"
          >
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              {task.alertText}
            </p>
          </PeekCard>
        ) : task.note ? (
          <PeekCard
            icon={StickyNote}
            title="Note"
            summary={task.note.length > 40 ? task.note.slice(0, 40) + '…' : task.note}
            accentColor="bg-muted"
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              {task.note}
            </p>
          </PeekCard>
        ) : (
          /* Empty placeholder for grid alignment */
          <div />
        )}
      </div>

      {/* Divider */}
      <hr className="border-t border-border" />

      {/* Instructions Section — collapsible, full-width flowing text */}
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

      {/* Standalone Note — only if there's both an alert AND a note */}
      {task.alertText && task.note && (
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
