/**
 * TaskFilters Component
 *
 * Inline filter dropdown for switching between task views.
 * Rendered at the top of the task list, under the page header.
 */

import { useNavigate, useParams } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getViewName, TASK_VIEWS } from '@/constants/statusColors'
import {
  ListChecks,
  User,
  UserCog,
  Eye,
  FileQuestion,
  Users,
  UsersRound,
  ArrowRightLeft,
  UserPlus,
  GitBranch,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const viewIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'all': ListChecks,
  'user-only': User,
  'pending-others': UserCog,
  'watcher': Eye,
  'rfi': FileQuestion,
  'team': Users,
  'extended-team': UsersRound,
  'delegated-out': ArrowRightLeft,
  'delegated-in': UserPlus,
  'profile': GitBranch,
}

export function TaskFilters() {
  const { viewId } = useParams<{ viewId: string }>()
  const navigate = useNavigate()

  const currentViewId = viewId || 'all'
  const currentViewName = getViewName(currentViewId)

  const handleViewChange = (newViewId: string) => {
    navigate(`/tasks/${newViewId}`)
  }

  return (
    <div className="px-4 py-2.5 border-b border-border/50 bg-card/30 flex items-center gap-3">
      {/* Breadcrumb-style label */}
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        View:
      </span>

      {/* View selector dropdown */}
      <Select value={currentViewId} onValueChange={handleViewChange}>
        <SelectTrigger className={cn(
          'w-auto h-8 px-3',
          'border border-border/50 bg-card',
          'text-xs font-medium'
        )}>
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent align="start">
          {TASK_VIEWS.map((view) => {
            const Icon = viewIconMap[view.id]
            return (
              <SelectItem key={view.id} value={view.id}>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                  <span>{view.name}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {/* Current view label */}
      <span className="text-xs text-foreground font-medium ml-2">
        {currentViewName}
      </span>
    </div>
  )
}
