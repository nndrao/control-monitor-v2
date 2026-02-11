/**
 * TaskDetailTabs Component
 *
 * Tab navigation + content switcher with Notion-style underline tabs.
 * Uses shadcn Tabs component but customized with underline style (not pill/card).
 *
 * Tabs:
 * 1. "Overview" (default) — Combined Instructions + Details
 * 2. "Dashboard" — Only shown if controlType is "Supervisor Dashboard Signoff"
 * 3. "Notes" — With count badge
 * 4. "Files" — With count badge
 * 5. "Info" — Additional info grid, only if data exists
 */

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
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

export function TaskDetailTabs({
  task,
  taskDetails,
  instructions,
  gridTheme,
}: TaskDetailTabsProps) {
  const showDashboard = task.controlType === 'Supervisor Dashboard Signoff'
  const firstTab = showDashboard ? 'dashboard' : 'overview'
  const [activeTab, setActiveTab] = useState(firstTab)

  // Reset to first tab whenever the selected task changes
  useEffect(() => {
    setActiveTab(firstTab)
  }, [task.id, firstTab])

  const noteCount = taskDetails?.notes?.length ?? 0
  const fileCount = taskDetails?.files?.length ?? 0
  const additionalInfoCount = taskDetails?.additionalInfo?.length ?? 0

  // Determine which tabs to show and their configuration
  const tabs = useMemo(
    () => {
      const tabConfig: Array<{
        value: string
        label: string
        icon: typeof BookOpen
        show: boolean
        count?: number
      }> = []

      if (showDashboard) {
        tabConfig.push({
          value: 'dashboard',
          label: 'Dashboard',
          icon: BarChart3,
          show: true,
        })
      }

      tabConfig.push({
        value: 'overview',
        label: 'Overview',
        icon: BookOpen,
        show: true,
      })

      tabConfig.push({
        value: 'notes',
        label: 'Notes',
        icon: MessageSquare,
        count: noteCount,
        show: true,
      })

      tabConfig.push({
        value: 'files',
        label: 'Files',
        icon: Paperclip,
        count: fileCount,
        show: true,
      })

      if (additionalInfoCount > 0) {
        tabConfig.push({
          value: 'info',
          label: 'Additional Information',
          icon: Database,
          count: additionalInfoCount,
          show: true,
        })
      }

      return tabConfig
    },
    [showDashboard, noteCount, fileCount, additionalInfoCount]
  )

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        {/* Tab List — Notion-style underline tabs */}
        <TabsList className="flex bg-transparent border-b border-border !px-6 !py-0 h-9 gap-4 rounded-none w-full justify-start">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'text-xs font-medium',
                  'border-b-2 border-transparent',
                  'text-muted-foreground',
                  'rounded-none px-0 py-2.5',
                  'data-[state=active]:border-foreground data-[state=active]:text-foreground',
                  'data-[state=active]:bg-transparent data-[state=active]:shadow-none',
                  'hover:text-foreground transition-colors',
                  'flex items-center gap-1.5'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 text-[10px] font-semibold text-muted-foreground">
                    ({tab.count})
                  </span>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Dashboard Tab — outside ScrollArea so it can flex-fill vertically */}
        {showDashboard && (
          <TabsContent value="dashboard" className="m-0 px-3 py-2 flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden">
            <DashboardTab task={task} gridTheme={gridTheme} />
          </TabsContent>
        )}

        {/* Other Tab Content — scrollable, hidden when Dashboard is active so it doesn't compete for flex space */}
        <ScrollArea className={cn("flex-1", activeTab === 'dashboard' && "hidden")}>
          {/* Overview Tab */}
          <TabsContent value="overview" className="m-0 px-6 py-4">
            <OverviewTab
              task={task}
              taskDetails={taskDetails}
              instructions={instructions}
            />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="m-0 px-6 py-4">
            <NotesTab notes={taskDetails?.notes ?? []} />
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="m-0 px-6 py-4">
            <FilesTab files={taskDetails?.files ?? []} />
          </TabsContent>

          {/* Additional Info Tab (conditional) */}
          {additionalInfoCount > 0 && (
            <TabsContent value="info" className="m-0 px-6 py-4">
              <AdditionalInfoTab
                data={taskDetails?.additionalInfo ?? []}
                gridTheme={gridTheme}
              />
            </TabsContent>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  )
}
