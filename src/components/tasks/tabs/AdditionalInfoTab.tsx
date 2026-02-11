/**
 * AdditionalInfoTab Component
 *
 * Display additional info rows in an AG-Grid with auto-height layout.
 * Shows trader alerts, source IDs, and related data in a structured table.
 */

import { memo, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, Theme } from 'ag-grid-community'
import type { AdditionalInfoRow } from '@/types/task-details.types'

interface AdditionalInfoTabProps {
  data: AdditionalInfoRow[]
  gridTheme: Theme
  className?: string
}

export const AdditionalInfoTab = memo(function AdditionalInfoTab({
  data,
  gridTheme,
  className,
}: AdditionalInfoTabProps) {
  const columnDefs = useMemo<ColDef<AdditionalInfoRow>[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 120,
        sortable: true,
        filter: true,
      },
      {
        field: 'taskId',
        headerName: 'Task ID',
        width: 100,
        sortable: true,
        filter: true,
      },
      {
        field: 'sourceAlertId',
        headerName: 'Source Alert ID',
        flex: 1,
        minWidth: 140,
        sortable: true,
        filter: true,
      },
      {
        field: 'trader',
        headerName: 'Trader',
        flex: 1,
        minWidth: 180,
        sortable: true,
        filter: true,
      },
      {
        field: 'traderEnt',
        headerName: 'Trader-Ent',
        width: 110,
        sortable: true,
        filter: true,
      },
    ],
    []
  )

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      suppressMovable: true,
    }),
    []
  )

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">
          No additional information available
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div style={{ height: 300, width: '100%' }}>
        <AgGridReact<AdditionalInfoRow>
          theme={gridTheme}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          headerHeight={32}
          rowHeight={28}
          suppressRowClickSelection={true}
          suppressTouch={false}
          alwaysShowVerticalScroll={true}
          alwaysShowHorizontalScroll={true}
          domLayout="normal"
        />
      </div>
    </div>
  )
})
