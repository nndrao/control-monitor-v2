/**
 * ControlHierarchyPanel Component
 *
 * Notion-style slide-out panel containing a control hierarchy tree grid.
 * Shows a 2-level hierarchy: ControlType → ControlName with due status counts.
 * Clicking a row filters the main task grid via URL query params.
 *
 * Also contains the task view selector dropdown for switching between views.
 */

import { useMemo, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  X,
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
  SlidersHorizontal,
  Layers,
} from 'lucide-react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, GetDataPath, ValueFormatterParams, RowClickedEvent } from 'ag-grid-community'
import { useAppContext } from '@/contexts/AppContext'
import { getAgGridTheme } from '@/themes/agGridTheme'
import { DUE_STATUS_COLORS } from '@/constants/statusColors'
import type { Task } from '@/hooks/useTaskData'

interface ControlHierarchyPanelProps {
  isOpen: boolean
  onClose: () => void
  tasks: Task[]
  className?: string
}

interface ControlHierarchyRow {
  id: string
  hierarchy: string[]
  total: number
  overdue: number
  today: number
  upcoming: number
}

const taskViewItems = [
  { name: 'All Tasks', path: '/tasks/all', icon: ListChecks },
  { name: 'My Tasks (User Only)', path: '/tasks/user-only', icon: User },
  { name: 'My Tasks (Pending Others)', path: '/tasks/pending-others', icon: UserCog },
  { name: 'My Watcher View', path: '/tasks/watcher', icon: Eye },
  { name: 'My RFI Tasks', path: '/tasks/rfi', icon: FileQuestion },
  { name: 'My Team Tasks', path: '/tasks/team', icon: Users },
  { name: 'My Extended Team Tasks', path: '/tasks/extended-team', icon: UsersRound },
  { name: 'My Tasks Delegated to Others', path: '/tasks/delegated-out', icon: ArrowRightLeft },
  { name: 'Tasks Delegated To Me', path: '/tasks/delegated-in', icon: UserPlus },
  { name: 'My Profile View', path: '/tasks/profile', icon: GitBranch },
]

/** Cell renderer for count values with semantic color coding */
function CountCellRenderer({ value, colorClass }: { value: number; colorClass: string }) {
  if (!value || value === 0) return null
  return (
    <span className={cn('font-semibold text-[11px]', colorClass)}>
      {value}
    </span>
  )
}

export function ControlHierarchyPanel({
  isOpen,
  onClose,
  tasks,
  className,
}: ControlHierarchyPanelProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme } = useAppContext()
  const gridRef = useRef<AgGridReact<ControlHierarchyRow>>(null)
  const gridTheme = getAgGridTheme(theme)

  // Build hierarchy data from tasks
  const hierarchyData = useMemo(() => {
    const controlTypeMap: Record<string, Record<string, { total: number; overdue: number; today: number; upcoming: number }>> = {}

    tasks.forEach((task) => {
      const { controlType, controlName, dueStatus } = task

      if (!controlTypeMap[controlType]) {
        controlTypeMap[controlType] = {}
      }
      if (!controlTypeMap[controlType][controlName]) {
        controlTypeMap[controlType][controlName] = { total: 0, overdue: 0, today: 0, upcoming: 0 }
      }

      controlTypeMap[controlType][controlName].total++

      const status = dueStatus?.toUpperCase()
      if (status === 'OVERDUE') {
        controlTypeMap[controlType][controlName].overdue++
      } else if (status === 'TODAY') {
        controlTypeMap[controlType][controlName].today++
      } else if (status === 'UPCOMING') {
        controlTypeMap[controlType][controlName].upcoming++
      }
    })

    const rows: ControlHierarchyRow[] = []

    Object.entries(controlTypeMap).forEach(([controlType, controlNames]) => {
      let typeTotal = 0, typeOverdue = 0, typeToday = 0, typeUpcoming = 0

      Object.values(controlNames).forEach((counts) => {
        typeTotal += counts.total
        typeOverdue += counts.overdue
        typeToday += counts.today
        typeUpcoming += counts.upcoming
      })

      // Parent row (Level 1)
      rows.push({
        id: controlType,
        hierarchy: [controlType],
        total: typeTotal,
        overdue: typeOverdue,
        today: typeToday,
        upcoming: typeUpcoming,
      })

      // Child rows (Level 2)
      Object.entries(controlNames).forEach(([controlName, counts]) => {
        rows.push({
          id: `${controlType}-${controlName}`,
          hierarchy: [controlType, controlName],
          total: counts.total,
          overdue: counts.overdue,
          today: counts.today,
          upcoming: counts.upcoming,
        })
      })
    })

    return rows.sort((a, b) => {
      if (a.hierarchy.length !== b.hierarchy.length) {
        return a.hierarchy.length - b.hierarchy.length
      }
      return a.hierarchy.join('').localeCompare(b.hierarchy.join(''))
    })
  }, [tasks])

  const getDataPath: GetDataPath<ControlHierarchyRow> = (data) => data.hierarchy

  // Column definitions with semantic color coding
  const columnDefs: ColDef<ControlHierarchyRow>[] = useMemo(() => [
    {
      field: 'overdue',
      headerName: '',
      width: 40,
      suppressHeaderMenuButton: true,
      cellStyle: { textAlign: 'right', paddingRight: '8px' },
      cellRenderer: (params: ValueFormatterParams<ControlHierarchyRow, number>) => (
        <CountCellRenderer value={params.value ?? 0} colorClass={DUE_STATUS_COLORS.OVERDUE.text} />
      ),
    },
    {
      field: 'today',
      headerName: '',
      width: 40,
      suppressHeaderMenuButton: true,
      cellStyle: { textAlign: 'right', paddingRight: '8px' },
      cellRenderer: (params: ValueFormatterParams<ControlHierarchyRow, number>) => (
        <CountCellRenderer value={params.value ?? 0} colorClass={DUE_STATUS_COLORS.TODAY.text} />
      ),
    },
    {
      field: 'upcoming',
      headerName: '',
      width: 40,
      suppressHeaderMenuButton: true,
      cellStyle: { textAlign: 'right', paddingRight: '8px' },
      cellRenderer: (params: ValueFormatterParams<ControlHierarchyRow, number>) => (
        <CountCellRenderer value={params.value ?? 0} colorClass={DUE_STATUS_COLORS.UPCOMING.text} />
      ),
    },
    {
      field: 'total',
      headerName: '',
      width: 40,
      suppressHeaderMenuButton: true,
      cellStyle: { textAlign: 'right', paddingRight: '8px' },
      cellRenderer: (params: ValueFormatterParams<ControlHierarchyRow, number>) => (
        <CountCellRenderer value={params.value ?? 0} colorClass="text-foreground" />
      ),
    },
  ], [])

  const autoGroupColumnDef: ColDef<ControlHierarchyRow> = useMemo(() => ({
    headerName: '',
    minWidth: 180,
    flex: 1,
    suppressHeaderMenuButton: true,
    cellRendererParams: {
      suppressCount: true,
    },
  }), [])

  // Get current filter values from URL params
  const searchParams = new URLSearchParams(location.search)
  const selectedControlType = searchParams.get('controlType') || ''
  const selectedControlName = searchParams.get('controlName') || ''
  const currentViewPath = location.pathname

  const handleViewChange = (path: string) => {
    navigate(path)
  }

  // Handle row click — toggle hierarchy filter via URL params
  const handleHierarchyRowClicked = useCallback((event: RowClickedEvent<ControlHierarchyRow>) => {
    const row = event.data
    if (!row) return

    const newSearchParams = new URLSearchParams(location.search)
    const isControlType = row.hierarchy.length === 1
    const clickedControlType = row.hierarchy[0]
    const clickedControlName = row.hierarchy.length > 1 ? row.hierarchy[1] : ''

    if (isControlType) {
      // Toggle off if same type already selected
      if (selectedControlType === clickedControlType && !selectedControlName) {
        newSearchParams.delete('controlType')
        newSearchParams.delete('controlName')
      } else {
        newSearchParams.set('controlType', clickedControlType)
        newSearchParams.delete('controlName')
      }
    } else {
      // Toggle off if same name already selected
      if (selectedControlName === clickedControlName) {
        newSearchParams.delete('controlType')
        newSearchParams.delete('controlName')
      } else {
        newSearchParams.set('controlType', clickedControlType)
        newSearchParams.set('controlName', clickedControlName)
      }
    }

    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString(),
    })
  }, [location, navigate, selectedControlType, selectedControlName])

  // Check if a row is currently selected (for highlight styling)
  const isRowSelected = useCallback((row: ControlHierarchyRow) => {
    if (row.hierarchy.length === 1) {
      return selectedControlType === row.hierarchy[0] && !selectedControlName
    } else {
      return selectedControlName === row.hierarchy[1]
    }
  }, [selectedControlType, selectedControlName])

  return (
    <div
      className={cn(
        'absolute left-3 top-3 w-[400px] bg-card border border-border rounded-lg flex flex-col overflow-hidden z-20',
        'shadow-lg',
        'transition-all duration-200 ease-out',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none',
        className,
      )}
      style={{ maxHeight: 'calc(100% - 24px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
            <SlidersHorizontal className="h-3 w-3 text-primary" />
          </div>
          <span className="text-[13px] font-semibold text-foreground tracking-tight">Filters</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          aria-label="Close filters panel"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Task View Selector */}
        <div className="p-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Eye className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Task View</span>
          </div>
          <Select value={currentViewPath} onValueChange={handleViewChange}>
            <SelectTrigger className="w-full h-7 text-[11px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              {taskViewItems.map((item) => {
                const Icon = item.icon
                return (
                  <SelectItem key={item.path} value={item.path} className="text-[11px]">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                      <span>{item.name}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Control Hierarchy Grid */}
        <div className="border-t border-border flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-2 flex-shrink-0 bg-muted/20">
            <Layers className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Control Hierarchy
            </span>
            {(selectedControlType || selectedControlName) && (
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(location.search)
                  newParams.delete('controlType')
                  newParams.delete('controlName')
                  navigate({ pathname: location.pathname, search: newParams.toString() })
                }}
                className="ml-auto text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="px-2 py-2" style={{ height: '350px' }}>
            <div style={{ height: '100%', width: '100%' }}>
              <AgGridReact<ControlHierarchyRow>
                ref={gridRef}
                theme={gridTheme}
                rowData={hierarchyData}
                columnDefs={columnDefs}
                treeData={true}
                getDataPath={getDataPath}
                autoGroupColumnDef={autoGroupColumnDef}
                groupDefaultExpanded={0}
                headerHeight={0}
                rowHeight={32}
                suppressCellFocus={true}
                animateRows={false}
                onRowClicked={handleHierarchyRowClicked}
                rowSelection="single"
                getRowStyle={(params) => {
                  if (params.data && isRowSelected(params.data)) {
                    return {
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      color: 'hsl(var(--primary))',
                      fontWeight: '600',
                      borderRadius: '6px',
                    }
                  }
                  return undefined
                }}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="px-3 py-2 border-t border-border flex items-center justify-center gap-4 bg-muted/10 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', DUE_STATUS_COLORS.OVERDUE.dot)} />
              <span className="text-[11px] font-medium text-muted-foreground">Overdue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', DUE_STATUS_COLORS.TODAY.dot)} />
              <span className="text-[11px] font-medium text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', DUE_STATUS_COLORS.UPCOMING.dot)} />
              <span className="text-[11px] font-medium text-muted-foreground">Upcoming</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-foreground" />
              <span className="text-[11px] font-medium text-muted-foreground">Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
