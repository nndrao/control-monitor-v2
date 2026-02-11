/**
 * AG-Grid Column Definitions for Task Manager
 *
 * Defines the structure and configuration for all columns in the task grid.
 * All fields from the Task interface are included as columns.
 * Some columns are hidden by default but available via column chooser.
 */

import type { ColDef } from 'ag-grid-community'
import type { Task } from '@/hooks/useTaskData'

export const columnDefs: ColDef<Task>[] = [
  // Originally visible columns
  {
    field: 'controlName',
    headerName: 'Control Name',
    width: 150,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
    minWidth: 200,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    width: 150,
    filter: 'agDateColumnFilter',
    valueFormatter: (params) => {
      if (!params.value) return ''
      return new Date(params.value).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    }
  },
  {
    field: 'assignedTo',
    headerName: 'Assigned User',
    width: 180,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'id',
    headerName: 'Task ID',
    width: 120,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'createdDate',
    headerName: 'Date Created',
    width: 150,
    filter: 'agDateColumnFilter',
    valueFormatter: (params) => {
      if (!params.value) return ''
      return new Date(params.value).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    }
  },
  {
    field: 'note',
    headerName: 'Note',
    flex: 1,
    minWidth: 200,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'responsibleEmployee',
    headerName: 'Responsible Employee',
    width: 200,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'controlType',
    headerName: 'Control Type',
    width: 180,
    filter: 'agTextColumnFilter',
    hide: true,
  },

  // Hidden columns (available via column chooser)
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
    minWidth: 250,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 100,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'dueStatus',
    headerName: 'Due Status',
    width: 120,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 180,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'controlTypeId',
    headerName: 'Control Type ID',
    width: 130,
    filter: 'agNumberColumnFilter',
    hide: true,
  },
  {
    field: 'completedDate',
    headerName: 'Completed Date',
    width: 150,
    filter: 'agDateColumnFilter',
    hide: true,
    valueFormatter: (params) => {
      if (!params.value) return ''
      return new Date(params.value).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    }
  },
  {
    field: 'workflowStepStatus',
    headerName: 'Workflow Step Status',
    width: 150,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'workflowStep',
    headerName: 'Workflow Step',
    width: 150,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'workflowType',
    headerName: 'Workflow Type',
    width: 150,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'workflowName',
    headerName: 'Workflow Name',
    width: 180,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'riskBunner',
    headerName: 'Risk Banner',
    width: 150,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'groupName',
    headerName: 'Group Name',
    width: 180,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'groupId',
    headerName: 'Group ID',
    width: 100,
    filter: 'agNumberColumnFilter',
    hide: true,
  },
  {
    field: 'stepId',
    headerName: 'Step ID',
    width: 100,
    filter: 'agNumberColumnFilter',
    hide: true,
  },
  {
    field: 'taskPathId',
    headerName: 'Task Path ID',
    width: 120,
    filter: 'agNumberColumnFilter',
    hide: true,
  },
  {
    field: 'stepNumber',
    headerName: 'Step Number',
    width: 120,
    filter: 'agNumberColumnFilter',
    hide: true,
  },
  {
    field: 'taskActivityId',
    headerName: 'Activity ID',
    width: 120,
    filter: 'agNumberColumnFilter',
    hide: true,
  },
  {
    field: 'taskType',
    headerName: 'Task Type',
    width: 100,
    filter: 'agNumberColumnFilter',
    hide: true,
  },
  {
    field: 'taskHierarchy',
    headerName: 'Task Hierarchy',
    width: 200,
    filter: 'agTextColumnFilter',
    hide: true,
    valueFormatter: (params) => {
      if (!params.value || !Array.isArray(params.value)) return ''
      return params.value.join(' > ')
    }
  },
  {
    field: 'taskStateAssignment',
    headerName: 'State Assignment',
    width: 150,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'alertText',
    headerName: 'Alert Text',
    flex: 1,
    minWidth: 200,
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'daysOverdue',
    headerName: 'Days Overdue',
    width: 120,
    filter: 'agNumberColumnFilter',
    hide: true,
  },
  {
    field: 'fileCount',
    headerName: 'File Count',
    width: 100,
    filter: 'agNumberColumnFilter',
    hide: true,
  },
]

export const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  filter: 'agTextColumnFilter',
  floatingFilter: true,
}
