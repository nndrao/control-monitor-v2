/**
 * DashboardTab Component
 *
 * Fixed icon sizes: h-3.5 w-3.5 (not size={11}).
 * Consistent tab styling with text-label.
 * Consistent spacing patterns.
 */

import { useState, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Target,
  MapPin,
  Building,
  Briefcase,
  AlertTriangle,
  BarChart3,
} from 'lucide-react'

import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { OffenderAnalysisCard } from '@/components/dashboard/OffenderAnalysisCard'
import {
  generateMetricsColumnDefs,
  defaultColDef,
  getAutoGroupColumnDef,
} from '@/components/dashboard/columnDefs/metricsGridColumns'

import { generateMockMetricScoringData } from '@/mockData/metrics'
import {
  transformMetricScoringData,
  calculateSummaryStats,
} from '@/utils/metricsDataTransform'

import type { TransformedMetricData } from '@/types/metrics'
import type { Task } from '@/hooks/useTaskData'
import type { Theme } from 'ag-grid-community'
import { useAppContext } from '@/contexts/AppContext'
import { getAgGridTheme } from '@/themes/agGridTheme'

interface DashboardTabProps {
  task: Task
  gridTheme: Theme
  metricsData?: TransformedMetricData[]
  isLoading?: boolean
  error?: string
}

type PivotMode = 'employees' | 'metrics' | 'region' | 'legal' | 'business'

interface TabConfig {
  id: PivotMode
  name: string
  icon: React.ComponentType<{ className?: string }>
  groupField: string
}

const TABS: TabConfig[] = [
  { id: 'employees', name: 'Employees', icon: Users, groupField: 'employeeName' },
  { id: 'metrics', name: 'Metrics', icon: Target, groupField: 'metricName' },
  { id: 'region', name: 'Region', icon: MapPin, groupField: 'region' },
  { id: 'legal', name: 'Legal Entity', icon: Building, groupField: 'company' },
  { id: 'business', name: 'Business', icon: Briefcase, groupField: 'business' },
]

const TrendCellRenderer = (params: { value: number }) => {
  const value = Object.is(params.value, -0) ? 0 : params.value

  if (value > 0) {
    return (
      <div className="font-semibold text-emerald-600 dark:text-emerald-400">
        +{value}
      </div>
    )
  }

  if (value < 0) {
    return (
      <div className="font-semibold text-orange-600 dark:text-orange-400">
        {value}
      </div>
    )
  }

  return <div className="text-muted-foreground">0</div>
}

export function DashboardTab({
  task,
  metricsData: externalData,
  isLoading = false,
  error,
}: DashboardTabProps) {
  const { theme } = useAppContext()
  const agGridTheme = getAgGridTheme(theme)
  const [activeTab, setActiveTab] = useState<PivotMode>('employees')

  const data = useMemo(() => {
    if (externalData) return externalData
    const seed = task.id
      ? String(task.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : undefined
    const rawData = generateMockMetricScoringData(200, seed)
    return transformMetricScoringData(rawData)
  }, [externalData, task.id])

  const summaryStats = useMemo(() => calculateSummaryStats(data), [data])

  const columnDefs = useMemo(() => {
    const options = {
      groupByEmployee: activeTab === 'employees',
      groupByMetric: activeTab === 'metrics',
      groupByRegion: activeTab === 'region',
      groupByLegalEntity: activeTab === 'legal',
      groupByBusiness: activeTab === 'business',
    }
    return generateMetricsColumnDefs(options)
  }, [activeTab])

  const autoGroupColumnDef = useMemo(() => {
    const tab = TABS.find((t) => t.id === activeTab)
    return getAutoGroupColumnDef(tab?.name || 'Group')
  }, [activeTab])

  const autoSizeStrategy = useMemo(() => ({
    type: 'fitCellContents' as const,
    skipHeader: false,
  }), [])

  const onGridReady = useCallback(() => {}, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-body">{error}</span>
        </div>
      </Card>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Summary Cards */}
      <div className="flex-shrink-0">
        <SummaryCards stats={summaryStats} />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="drilldown" className="flex-1 flex flex-col min-h-0 mt-2.5">
        <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="px-3 pt-1.5 pb-0 bg-muted/20 border-b border-border flex-shrink-0">
            <TabsList className="flex h-7 bg-transparent rounded-none w-full justify-start !px-0 !py-0 gap-1">
              <TabsTrigger
                value="drilldown"
                className="text-label font-medium text-muted-foreground gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none h-7 px-2.5"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Monthly Drill-Down
              </TabsTrigger>
              <TabsTrigger
                value="offenders"
                className="text-label font-medium text-muted-foreground gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none h-7 px-2.5"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Offender Analysis
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Monthly Drill-Down Tab */}
          <TabsContent value="drilldown" className="m-0 flex-1 flex flex-col min-h-0 data-[state=inactive]:hidden">
            <div className="p-3 border-b border-border flex-shrink-0">
              <div className="flex gap-2 flex-wrap">
                {TABS.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <Button
                      key={tab.id}
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.name}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="flex-1 min-h-0 relative">
              <div className="absolute inset-0">
                <AgGridReact
                  theme={agGridTheme}
                  rowData={data}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  autoGroupColumnDef={autoGroupColumnDef}
                  autoSizeStrategy={autoSizeStrategy}
                  animateRows={true}
                  suppressRowClickSelection={true}
                  groupDefaultExpanded={0}
                  onGridReady={onGridReady}
                  components={{
                    trendCellRenderer: TrendCellRenderer,
                  }}
                />
              </div>
            </div>
          </TabsContent>

          {/* Offender Analysis Tab */}
          <TabsContent value="offenders" className="m-0 flex-1 flex flex-col min-h-0 data-[state=inactive]:hidden">
            <OffenderAnalysisCard metricsData={data} />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
}
