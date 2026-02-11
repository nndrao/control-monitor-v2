import type { ColDef } from 'ag-grid-community'
import type { OffenderGroup, EmployeeOffender } from '@/types/metrics'

/**
 * Column definitions for "By Metric" view
 */
export function getMetricOffenderColumns(): ColDef<OffenderGroup>[] {
  return [
    {
      field: 'metric',
      headerName: 'Metric',
      flex: 1,
      minWidth: 200,
      cellClass: 'font-medium',
    },
    {
      field: 'employees',
      headerName: 'Employees',
      width: 120,
      cellClass: 'text-center',
      valueGetter: (params) => params.data?.employees.length || 0,
    },
    {
      field: 'total',
      headerName: 'Count',
      width: 100,
      cellClass: 'text-center font-medium',
      cellStyle: {
        color: '#ef4444',
        fontWeight: '600',
      },
    },
  ]
}

/**
 * Column definitions for "By Employee" view
 */
export function getEmployeeOffenderColumns(): ColDef<EmployeeOffender>[] {
  return [
    {
      field: 'employee',
      headerName: 'Employee',
      flex: 1,
      minWidth: 200,
      cellClass: 'font-medium',
    },
    {
      field: 'countOfMetric',
      headerName: 'Metric Count',
      width: 150,
      cellClass: 'text-center font-medium',
      cellStyle: {
        color: '#ef4444',
        fontWeight: '600',
      },
    },
  ]
}

/**
 * Default column definition for offender analysis grids
 */
export const offenderDefaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  filter: false,
}
