/**
 * DashboardTab Component
 *
 * Two clear zones:
 * 1. Toolbar — summary metrics + view mode toggle in a single contained bar
 * 2. Content — grid (with pivot selector) or offender analysis, fills remaining space
 */

import { useState, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  Target,
  MapPin,
  Building,
  Briefcase,
  AlertTriangle,
  BarChart3,
} from 'lucide-react'

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
import { Card } from '@/components/ui/card'

interface DashboardTabProps {
  task: Task
  gridTheme: Theme
  metricsData?: TransformedMetricData[]
  isLoading?: boolean
  error?: string
}

type PivotMode = 'employees' | 'metrics' | 'region' | 'legal' | 'business'
type ViewMode = 'drilldown' | 'offenders'

interface PivotConfig {
  id: PivotMode
  name: string
  icon: React.ComponentType<{ className?: string }>
  groupField: string
}

const PIVOTS: PivotConfig[] = [
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
  const [activePivot, setActivePivot] = useState<PivotMode>('employees')
  const [viewMode, setViewMode] = useState<ViewMode>('drilldown')

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
      groupByEmployee: activePivot === 'employees',
      groupByMetric: activePivot === 'metrics',
      groupByRegion: activePivot === 'region',
      groupByLegalEntity: activePivot === 'legal',
      groupByBusiness: activePivot === 'business',
    }
    return generateMetricsColumnDefs(options)
  }, [activePivot])

  const autoGroupColumnDef = useMemo(() => {
    const pivot = PIVOTS.find((t) => t.id === activePivot)
    return getAutoGroupColumnDef(pivot?.name || 'Group')
  }, [activePivot])

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
      <Card className="m-3 p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-body">{error}</span>
        </div>
      </Card>
    )
  }

  const metrics = [
    { value: summaryStats.totalRows, label: 'Emp', dot: 'bg-blue-500' },
    { value: summaryStats.totalBreaches, label: 'Breach', dot: 'bg-red-500' },
    { value: summaryStats.totalPotentialBreaches, label: 'Potential', dot: 'bg-amber-500' },
    { value: summaryStats.currentMonth, label: 'Period', dot: 'bg-emerald-500' },
  ]

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar — summary metrics row + view toggle row */}
      <div className="flex-shrink-0 border-b border-border bg-muted/30 px-4 py-2 space-y-1.5">
        {/* Row 1: Summary metrics */}
        <div className="flex items-center gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
              <span className="text-xs font-semibold tabular-nums text-foreground">{m.value}</span>
              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Row 2: View toggle */}
        <div className="flex">
          <div className="flex bg-background rounded-md p-0.5 border border-border/50">
            <button
              onClick={() => setViewMode('drilldown')}
              className={`flex items-center gap-1 px-2 h-5 rounded-sm text-[10px] font-medium transition-colors ${
                viewMode === 'drilldown'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 className="h-2.5 w-2.5" />
              Drill-Down
            </button>
            <button
              onClick={() => setViewMode('offenders')}
              className={`flex items-center gap-1 px-2 h-5 rounded-sm text-[10px] font-medium transition-colors ${
                viewMode === 'offenders'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <AlertTriangle className="h-2.5 w-2.5" />
              Offenders
            </button>
          </div>
        </div>
      </div>

      {/* Content zone */}
      {viewMode === 'drilldown' ? (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Pivot selector row */}
          <div className="flex items-center px-4 py-1.5 flex-shrink-0">
            <Select value={activePivot} onValueChange={(v) => setActivePivot(v as PivotMode)}>
              <SelectTrigger className="h-7 w-[140px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PIVOTS.map((pivot) => {
                  const Icon = pivot.icon
                  return (
                    <SelectItem key={pivot.id} value={pivot.id} className="text-xs">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                        <span>{pivot.name}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          {/* Grid */}
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
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <OffenderAnalysisCard metricsData={data} />
        </div>
      )}
    </div>
  )
}
