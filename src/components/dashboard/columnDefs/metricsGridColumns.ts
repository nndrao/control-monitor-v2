import type { ColDef, ColGroupDef } from 'ag-grid-community'

// Month names for headers
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// Get current quarter (0-3)
function getCurrentQuarter(): number {
  return Math.floor(new Date().getMonth() / 3)
}

/**
 * Generate column definitions for the metrics grid
 */
export function generateMetricsColumnDefs(options: {
  groupByEmployee?: boolean
  groupByMetric?: boolean
  groupByRegion?: boolean
  groupByLegalEntity?: boolean
  groupByBusiness?: boolean
  year?: number
}): (ColDef | ColGroupDef)[] {
  const {
    year = new Date().getFullYear(),
  } = options

  const currentQuarter = getCurrentQuarter()
  const yearShort = year.toString().slice(-2)

  const columns: (ColDef | ColGroupDef)[] = []

  // Reportee Type column
  columns.push({
    field: 'hierarchySource',
    headerName: 'Reportee Type',
    width: 180,
  })

  // Quarterly column groups
  for (let q = 0; q < 4; q++) {
    const quarterNum = q + 1
    const startMonth = q * 3

    const quarterGroup: ColGroupDef = {
      headerName: `Q${quarterNum} '${yearShort}`,
      openByDefault: q === currentQuarter,
      children: [
        // Subtotal column (visible when collapsed)
        {
          field: `q${quarterNum}Subtotal`,
          headerName: `Q${quarterNum}`,
          width: 80,
          columnGroupShow: 'closed',
          aggFunc: 'sum',
          valueGetter: (params) => {
            if (!params.data?.metricsData) return 0
            const md = params.data.metricsData
            const m1 = `month${(startMonth + 1).toString().padStart(2, '0')}`
            const m2 = `month${(startMonth + 2).toString().padStart(2, '0')}`
            const m3 = `month${(startMonth + 3).toString().padStart(2, '0')}`
            return (
              (md[m1]?.score || 0) +
              (md[m2]?.score || 0) +
              (md[m3]?.score || 0)
            )
          },
          cellClass: 'text-center font-medium',
          valueFormatter: (params) => {
            if (!params.value) return '-'
            return params.value.toString()
          },
        },
        // Individual month columns (visible when expanded)
        ...Array.from({ length: 3 }, (_, i) => {
          const monthIndex = startMonth + i
          const monthNum = (monthIndex + 1).toString().padStart(2, '0')
          return {
            field: `metricsData.month${monthNum}.score`,
            headerName: MONTH_NAMES[monthIndex],
            width: 70,
            columnGroupShow: 'open' as const,
            aggFunc: 'sum',
            cellClass: 'text-center',
            valueFormatter: (params: { value: unknown }) => {
              if (!params.value) return '-'
              return String(params.value)
            },
          }
        }),
      ],
    }

    columns.push(quarterGroup)
  }

  // Total column
  columns.push({
    field: 'total',
    headerName: 'Total',
    width: 90,
    pinned: 'right',
    aggFunc: 'sum',
    valueGetter: (params) => {
      if (!params.data?.metricsData) return 0
      let total = 0
      for (let i = 1; i <= 12; i++) {
        const key = `month${i.toString().padStart(2, '0')}`
        total += params.data.metricsData[key]?.score || 0
      }
      return total
    },
    cellClass: 'text-center font-bold',
    cellStyle: { backgroundColor: '#ef4444', color: '#fff' },
  })

  // Trend column
  columns.push({
    field: 'trend',
    headerName: 'Trend',
    width: 100,
    pinned: 'right',
    cellClass: 'text-center',
    valueGetter: (params) => {
      if (!params.data?.metricsData) return 0
      const current = params.data.metricsData.month12?.score || 0
      const previous = params.data.metricsData.month11?.score || 0
      const trend = current - previous
      if (Object.is(trend, -0)) return 0
      return trend
    },
    cellRenderer: 'trendCellRenderer',
  })

  return columns
}

/**
 * Default column definition
 */
export const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  filter: false,
  minWidth: 60,
}

/**
 * Auto group column definition
 */
export function getAutoGroupColumnDef(groupName: string = 'Employee'): ColDef {
  return {
    headerName: groupName,
    minWidth: 250,
    flex: 1,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      suppressCount: true,
      footerValueGetter: (params: { node: { level: number }; value: string }) => {
        const isRootLevel = params.node.level === -1
        return isRootLevel ? 'Grand Total' : `Sub Total (${params.value})`
      },
    },
    pinned: 'left',
    lockPinned: true,
    suppressMovable: true,
  }
}
