/**
 * TaskDetailTabs Component
 *
 * Consistent tab styling with text-label (12px) typography.
 * Underline-style tabs with h-3.5 w-3.5 icons.
 * Count badges use text-caption.
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

  useEffect(() => {
    setActiveTab(firstTab)
  }, [task.id, firstTab])

  const noteCount = taskDetails?.notes?.length ?? 0
  const fileCount = taskDetails?.files?.length ?? 0
  const additionalInfoCount = taskDetails?.additionalInfo?.length ?? 0

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
          label: 'Info',
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
        {/* Tab List — consistent underline tabs with text-label */}
        <TabsList className="flex bg-transparent border-b border-border !px-5 !py-0 h-9 gap-4 rounded-none w-full justify-start">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'text-label font-medium',
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
                  <span className="ml-0.5 text-caption font-semibold text-muted-foreground">
                    ({tab.count})
                  </span>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Dashboard Tab — outside ScrollArea for flex-fill */}
        {showDashboard && (
          <TabsContent value="dashboard" className="m-0 px-3 py-2 flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden">
            <DashboardTab task={task} gridTheme={gridTheme} />
          </TabsContent>
        )}

        {/* Other Tab Content — scrollable with custom scrollbar */}
        <ScrollArea className={cn("flex-1 scrollbar-thin", activeTab === 'dashboard' && "hidden")}>
          <TabsContent value="overview" className="m-0 px-5 py-4">
            <OverviewTab
              task={task}
              taskDetails={taskDetails}
              instructions={instructions}
            />
          </TabsContent>

          <TabsContent value="notes" className="m-0 px-5 py-4">
            <NotesTab notes={taskDetails?.notes ?? []} />
          </TabsContent>

          <TabsContent value="files" className="m-0 px-5 py-4">
            <FilesTab files={taskDetails?.files ?? []} />
          </TabsContent>

          {additionalInfoCount > 0 && (
            <TabsContent value="info" className="m-0 px-5 py-4">
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
