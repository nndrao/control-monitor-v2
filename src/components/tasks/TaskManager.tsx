/**
 * TaskManager Component
 *
 * Main task management view with:
 * - Interactive status chip filters
 * - Density toggle (compact/default/comfortable)
 * - Grid row visual encoding by due status
 * - Responsive detail panel (smaller default on tablet)
 * - Consistent typography and spacing tokens
 */

import { useAppContext } from '@/contexts/AppContext'
import { useParams, useLocation } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import type { RowClickedEvent, IsExternalFilterPresentParams, RowClassParams } from 'ag-grid-community'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { AllEnterpriseModule } from 'ag-grid-enterprise'
import { useTaskData, type Task } from '@/hooks/useTaskData'
import { useTaskDetails } from '@/hooks/useTaskDetails'
import { getAgGridTheme } from '@/themes/agGridTheme'
import { columnDefs, defaultColDef } from './columnDefs'
import { PageHeader } from '@/components/layout/PageHeader'
import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ChevronDown, AlertCircle, SlidersHorizontal, PlayCircle, Rows3, Rows4, AlignJustify } from 'lucide-react'
import { useMemo, useRef, useEffect, useCallback, useState } from 'react'
import { TaskDetailsPanel } from './TaskDetailsPanel'
import { StatusChips } from '@/components/shared/StatusChips'
import { ControlHierarchyPanel } from './ControlHierarchyPanel'
import { useResizable } from '@/hooks/useResizable'
import { cn } from '@/lib/utils'
import { getViewName } from '@/constants/statusColors'

// Register AG Grid modules once at module level
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule])

type DensityMode = 'compact' | 'default' | 'comfortable'

const DENSITY_CONFIG: Record<DensityMode, { rowHeight: number; icon: typeof Rows3; label: string }> = {
  compact: { rowHeight: 28, icon: AlignJustify, label: 'Compact' },
  default: { rowHeight: 36, icon: Rows4, label: 'Default' },
  comfortable: { rowHeight: 44, icon: Rows3, label: 'Comfortable' },
}

/** Resize handle rendered on the left edge of the details panel */
function ResizeHandle({
  onMouseDown,
  onTouchStart,
}: {
  onMouseDown: (e: React.MouseEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
}) {
  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-1 hover:w-2 bg-border hover:bg-primary cursor-ew-resize z-30 transition-all touch-none group"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-y-0 -left-2 -right-2" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="w-0.5 h-6 bg-primary/60 rounded-full" />
          <div className="w-0.5 h-6 bg-primary/60 rounded-full" />
          <div className="w-0.5 h-6 bg-primary/60 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function TaskManager() {
  const { theme } = useAppContext()
  const { viewId } = useParams<{ viewId: string }>()
  const location = useLocation()

  const filterType = viewId || 'all'
  const viewName = getViewName(filterType)

  const { tasks, loading, error } = useTaskData(filterType)
  const gridRef = useRef<AgGridReact<Task>>(null)
  const gridTheme = getAgGridTheme(theme)
  const [searchValue, setSearchValue] = useState('')
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false)
  const [selectedRowCount, setSelectedRowCount] = useState(0)
  const [density, setDensity] = useState<DensityMode>('default')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // Task details panel state
  const {
    selectedTask,
    taskDetails,
    loading: detailsLoading,
    isPanelOpen,
    isExpanded,
    toggleTask,
    closePanel,
    toggleExpand,
  } = useTaskDetails()

  // Panel resize — responsive default (smaller on tablet)
  const {
    width: panelWidth,
    isResizing,
    handleResizeStart,
    handleTouchResizeStart,
  } = useResizable({ defaultWidth: 460, minWidth: 380, maxWidthOffset: 300 })

  // Handle search input change and apply quick filter
  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption('quickFilterText', value)
    }
  }

  // Row click handler - opens task details panel
  const handleRowClicked = useCallback((event: RowClickedEvent<Task>) => {
    const task = event.data
    if (task) toggleTask(task)
  }, [toggleTask])

  // Track row checkbox selection
  const handleSelectionChanged = useCallback(() => {
    if (gridRef.current?.api) {
      const selected = gridRef.current.api.getSelectedRows()
      setSelectedRowCount(selected.length)
    }
  }, [])

  // Status filter: external filter for AG Grid
  const isExternalFilterPresent = useCallback((_params: IsExternalFilterPresentParams) => {
    return statusFilter !== null
  }, [statusFilter])

  const doesExternalFilterPass = useCallback((node: { data: Task | undefined }) => {
    if (!statusFilter) return true
    return node.data?.dueStatus?.toUpperCase() === statusFilter
  }, [statusFilter])

  // When status filter changes, refresh grid
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.onFilterChanged()
    }
  }, [statusFilter])

  // Handle status chip click
  const handleStatusFilterClick = useCallback((filter: string | null) => {
    setStatusFilter(filter)
  }, [])

  // Cycle density mode
  const cycleDensity = useCallback(() => {
    const modes: DensityMode[] = ['compact', 'default', 'comfortable']
    const currentIdx = modes.indexOf(density)
    setDensity(modes[(currentIdx + 1) % modes.length])
  }, [density])

  // Update grid row height when density changes
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.resetRowHeights()
    }
  }, [density])

  // Row class rules for visual encoding by due status
  const rowClassRules = useMemo(() => ({
    'border-l-[3px] border-l-red-500': (params: RowClassParams<Task>) =>
      params.data?.dueStatus?.toUpperCase() === 'OVERDUE',
    'border-l-[3px] border-l-amber-500': (params: RowClassParams<Task>) =>
      params.data?.dueStatus?.toUpperCase() === 'TODAY',
    'border-l-[3px] border-l-emerald-500': (params: RowClassParams<Task>) =>
      params.data?.dueStatus?.toUpperCase() === 'UPCOMING',
    'border-l-[3px] border-l-purple-500': (params: RowClassParams<Task>) =>
      params.data?.dueStatus?.toUpperCase() === 'COMPLETED',
  }), [])

  // Grid options
  const gridOptions = useMemo(() => ({
    rowSelection: {
      mode: 'multiRow' as const,
      checkboxes: true,
      headerCheckbox: true,
      enableClickSelection: false,
    },
    enableRangeSelection: true,
    onRowClicked: handleRowClicked,
    onSelectionChanged: handleSelectionChanged,
    cacheQuickFilter: true,
    sideBar: {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
      ],
    },
  }), [handleRowClicked, handleSelectionChanged])

  // Auto-open filters panel when ?hierarchy=true is in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('hierarchy') === 'true') {
      setIsFiltersPanelOpen(true)
    }
  }, [location.search])

  // Handle theme changes
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.refreshCells({ force: true })
    }
  }, [theme, filterType])

  // Apply control hierarchy filters from URL query params
  useEffect(() => {
    const applyHierarchyFilters = async () => {
      if (!gridRef.current?.api) return

      const searchParams = new URLSearchParams(location.search)
      const selectedControlType = searchParams.get('controlType') || ''
      const selectedControlName = searchParams.get('controlName') || ''

      const controlTypeFilter = await gridRef.current.api.getColumnFilterInstance('controlType')
      if (controlTypeFilter) {
        controlTypeFilter.setModel(
          selectedControlType ? { type: 'equals', filter: selectedControlType } : null
        )
      }

      const controlNameFilter = await gridRef.current.api.getColumnFilterInstance('controlName')
      if (controlNameFilter) {
        controlNameFilter.setModel(
          selectedControlName ? { type: 'equals', filter: selectedControlName } : null
        )
      }

      gridRef.current.api.onFilterChanged()
    }

    applyHierarchyFilters()
  }, [location.search])

  // Check if hierarchy filter is active
  const urlSearchParams = new URLSearchParams(location.search)
  const hasHierarchyFilter = urlSearchParams.has('controlType') || urlSearchParams.has('controlName')

  const DensityIcon = DENSITY_CONFIG[density].icon

  return (
    <div className="h-full w-full flex flex-col">
      <PageHeader
        subtitle={viewName}
        leading={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-7 gap-1.5 font-medium px-2.5',
              hasHierarchyFilter && 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
            )}
            onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {hasHierarchyFilter && (
              <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </Button>
        }
        center={
          <StatusChips
            tasks={tasks}
            activeFilter={statusFilter}
            onFilterClick={handleStatusFilterClick}
          />
        }
      >
        {/* Search */}
        <div className="w-44 desktop:w-52">
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
          />
        </div>

        {/* Density Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={cycleDensity}
            >
              <DensityIcon className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Density: {DENSITY_CONFIG[density].label}
          </TooltipContent>
        </Tooltip>

        {/* Separator */}
        <div className="w-px h-4 bg-border" />

        {/* Initiate Review Button */}
        <Button
          variant="default"
          size="sm"
          className="h-7 gap-1.5 font-medium px-3"
          disabled={selectedRowCount === 0}
        >
          <PlayCircle className="h-3.5 w-3.5" />
          <span className="hidden desktop:inline">Initiate Review</span>
          <span className="desktop:hidden">Review</span>
          {selectedRowCount > 0 && (
            <span className="ml-0.5 text-caption font-bold bg-white/20 rounded px-1 min-w-[18px] text-center">
              {selectedRowCount}
            </span>
          )}
        </Button>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 font-medium px-2.5 gap-1">
              Actions
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem>Request for Info</DropdownMenuItem>
            <DropdownMenuItem>Add Notes/Files</DropdownMenuItem>
            <DropdownMenuItem>View Activity</DropdownMenuItem>
            <DropdownMenuItem>Delegation & Assignment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>

      {/* Main Content Area — Master-Detail Split */}
      <div className="flex-1 overflow-hidden relative">
        {/* Control Hierarchy Overlay Panel */}
        <ControlHierarchyPanel
          isOpen={isFiltersPanelOpen}
          onClose={() => setIsFiltersPanelOpen(false)}
          tasks={tasks}
        />

        {/* Master-Detail Split Layout */}
        <div className="h-full w-full flex overflow-hidden">
          {/* Grid Area — takes remaining space */}
          {!isExpanded && (
            <div className="flex-1 min-w-0 h-full overflow-hidden">
              <div className="h-full w-full p-3">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
                      <p className="text-body text-muted-foreground">Loading tasks...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-2">
                      <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                      <p className="text-body text-destructive">Error: {error.message}</p>
                    </div>
                  </div>
                ) : (
                  <AgGridReact<Task>
                    ref={gridRef}
                    theme={gridTheme}
                    rowData={tasks}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowHeight={DENSITY_CONFIG[density].rowHeight}
                    rowClassRules={rowClassRules}
                    isExternalFilterPresent={isExternalFilterPresent}
                    doesExternalFilterPass={doesExternalFilterPass}
                    {...gridOptions}
                  />
                )}
              </div>
            </div>
          )}

          {/* Details Panel — shares viewport with grid */}
          {isPanelOpen && selectedTask && (
            <div
              className={cn(
                'h-full border-l border-border flex-shrink-0 relative bg-card overflow-hidden animate-slide-in-right',
                isExpanded && 'flex-1',
                'transition-all duration-200 ease-out'
              )}
              style={isExpanded ? undefined : {
                width: `${panelWidth}px`,
                transition: isResizing ? 'none' : 'width 200ms ease',
              }}
            >
              {/* Resize Handle (hidden when expanded) */}
              {!isExpanded && (
                <ResizeHandle
                  onMouseDown={handleResizeStart}
                  onTouchStart={handleTouchResizeStart}
                />
              )}

              <TaskDetailsPanel
                task={selectedTask}
                taskDetails={taskDetails}
                loading={detailsLoading}
                onClose={closePanel}
                isExpanded={isExpanded}
                onToggleExpand={toggleExpand}
                className="h-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
