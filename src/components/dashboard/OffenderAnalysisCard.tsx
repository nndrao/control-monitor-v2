/**
 * OffenderAnalysisCard Component
 *
 * Shows repeat offenders grouped by metric or by employee.
 * Uses AG Grid with toggleable view modes.
 */

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AgGridReact } from 'ag-grid-react'

import type { TransformedMetricData } from '@/types/metrics'
import {
  groupOffendersByMetric,
  groupOffendersByEmployee,
} from '@/utils/metricsDataTransform'
import {
  getMetricOffenderColumns,
  getEmployeeOffenderColumns,
  offenderDefaultColDef,
} from './columnDefs/offenderAnalysisColumns'
import { useAppContext } from '@/contexts/AppContext'
import { getAgGridTheme } from '@/themes/agGridTheme'

interface OffenderAnalysisCardProps {
  metricsData: TransformedMetricData[]
}

type ViewMode = 'metric' | 'employee'

export const OffenderAnalysisCard: React.FC<OffenderAnalysisCardProps> = ({
  metricsData,
}) => {
  const { theme } = useAppContext()
  const agGridTheme = getAgGridTheme(theme)
  const [activeView, setActiveView] = useState<ViewMode>('metric')

  // Group data
  const metricGroups = useMemo(
    () => groupOffendersByMetric(metricsData),
    [metricsData]
  )
  const employeeOffenders = useMemo(
    () => groupOffendersByEmployee(metricsData),
    [metricsData]
  )

  // Grand total
  const grandTotal = metricsData.length

  // Column definitions based on active view
  const columnDefs = useMemo(() => {
    return activeView === 'metric'
      ? getMetricOffenderColumns()
      : getEmployeeOffenderColumns()
  }, [activeView])

  // Row data based on active view
  const rowData = useMemo(() => {
    return activeView === 'metric' ? metricGroups : employeeOffenders
  }, [activeView, metricGroups, employeeOffenders])

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
        <p className="text-xs text-muted-foreground">
          View repeat offenders grouped by metric or employee
        </p>

        {/* View Toggle */}
        <div className="flex gap-0.5 bg-muted rounded-md p-0.5">
          <Button
            variant={activeView === 'metric' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('metric')}
          >
            By Metric
          </Button>
          <Button
            variant={activeView === 'employee' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('employee')}
          >
            By Employee
          </Button>
        </div>
      </div>

      {/* AG Grid Content — fills remaining space */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0">
          <AgGridReact
            theme={agGridTheme}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={offenderDefaultColDef}
            animateRows={true}
            suppressRowClickSelection={true}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-muted/30 flex-shrink-0">
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">
              {activeView === 'metric'
                ? metricGroups.length
                : employeeOffenders.length}
            </span>{' '}
            {activeView === 'metric' ? 'metrics' : 'employees'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Grand Total</span>
            <Badge variant="destructive" className="h-6 text-sm px-2.5">
              {grandTotal}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
