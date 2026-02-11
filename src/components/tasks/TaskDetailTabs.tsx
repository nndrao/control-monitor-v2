/**
 * TaskDetailTabs — Underline Tab Navigation
 *
 * Clean underline-style tabs for quick section switching.
 * Clear visual separation between navigation and content.
 * Dashboard tab uses flex layout for AG Grid compatibility.
 */

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  BarChart3,
  MessageSquare,
  Paperclip,
  Database,
} from 'lucide-react'
import { OverviewTab } from './tabs/OverviewTab'
import { DashboardTab } from './tabs/DashboardTab'
import { NotesTab } from './tabs/NotesTab'
import { FilesTab } from './tabs/FilesTab'
import { AdditionalInfoTab } from './tabs/AdditionalInfoTab'
import type { Task } from '@/hooks/useTaskData'
import type { TaskDetails, ControlInstruction } from '@/types/task-details.types'
import type { Theme } from 'ag-grid-community'

interface TaskDetailTabsProps {
  task: Task
  taskDetails: TaskDetails | null
  instructions: ControlInstruction
  gridTheme: Theme
}

interface TabConfig {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}

export function TaskDetailTabs({
  task,
  taskDetails,
  instructions,
  gridTheme,
}: TaskDetailTabsProps) {
  const showDashboard = task.controlType === 'Supervisor Dashboard Signoff'

  const noteCount = taskDetails?.notes?.length ?? 0
  const fileCount = taskDetails?.files?.length ?? 0
  const additionalInfoCount = taskDetails?.additionalInfo?.length ?? 0

  const tabs = useMemo<TabConfig[]>(() => {
    const t: TabConfig[] = []
    if (showDashboard) {
      t.push({ id: 'dashboard', label: 'Dashboard', icon: BarChart3 })
    }
    t.push({ id: 'overview', label: 'Overview', icon: BookOpen })
    t.push({ id: 'notes', label: 'Notes', icon: MessageSquare, count: noteCount })
    t.push({ id: 'files', label: 'Files', icon: Paperclip, count: fileCount })
    if (additionalInfoCount > 0) {
      t.push({ id: 'info', label: 'Info', icon: Database, count: additionalInfoCount })
    }
    return t
  }, [showDashboard, noteCount, fileCount, additionalInfoCount])

  const [activeTab, setActiveTab] = useState(() => tabs[0]?.id ?? 'overview')

  return (
    <div className="h-full flex flex-col">
      {/* Tab Bar — underline style */}
      <div className="flex-shrink-0 px-4 border-b border-border">
        <div className="flex items-center gap-0.5 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors relative',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5 flex-shrink-0', isActive && 'text-primary')} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-[9px] font-semibold bg-muted text-muted-foreground rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 tabular-nums">
                    {tab.count}
                  </span>
                )}
                {/* Active underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content — fills remaining space */}
      <div className="flex-1 min-h-0 bg-muted/5">
        {activeTab === 'dashboard' && showDashboard && (
          <div className="h-full flex flex-col">
            <DashboardTab task={task} gridTheme={gridTheme} />
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="h-full overflow-y-auto scrollbar-thin px-5 py-4">
            <OverviewTab
              task={task}
              taskDetails={taskDetails}
              instructions={instructions}
            />
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="h-full overflow-y-auto scrollbar-thin px-5 py-4">
            <NotesTab notes={taskDetails?.notes ?? []} />
          </div>
        )}

        {activeTab === 'files' && (
          <div className="h-full overflow-y-auto scrollbar-thin px-5 py-4">
            <FilesTab files={taskDetails?.files ?? []} />
          </div>
        )}

        {activeTab === 'info' && additionalInfoCount > 0 && (
          <div className="h-full overflow-y-auto scrollbar-thin px-5 py-4">
            <AdditionalInfoTab
              data={taskDetails?.additionalInfo ?? []}
              gridTheme={gridTheme}
            />
          </div>
        )}
      </div>
    </div>
  )
}
