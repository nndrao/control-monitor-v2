/**
 * useTaskDetails Hook
 *
 * Manages state and data fetching for the task details panel.
 * Generates mock data synchronously (no artificial delay) for instant responsiveness.
 */

import { useState, useCallback } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { generateTaskDetails } from '@/mockData/taskDetailsGenerator'
import type { TaskDetails } from '@/types/task-details.types'
import type { Task } from './useTaskData'

interface UseTaskDetailsReturn {
  selectedTask: Task | null
  taskDetails: TaskDetails | null
  loading: boolean
  error: Error | null
  isPanelOpen: boolean
  isExpanded: boolean
  selectTask: (task: Task) => Promise<void>
  closePanel: () => void
  toggleTask: (task: Task) => Promise<void>
  toggleExpand: () => void
}

export function useTaskDetails(): UseTaskDetailsReturn {
  const { useMockData } = useAppContext()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const selectTask = useCallback(async (task: Task) => {
    setSelectedTask(task)
    setError(null)

    try {
      if (useMockData) {
        // Generate mock data synchronously — no artificial delay
        const details = generateTaskDetails({
          id: task.id,
          title: task.title,
          description: task.description,
          category: task.category,
          controlName: task.controlName,
          controlType: task.controlType,
          fileCount: task.fileCount,
        })
        setTaskDetails(details)
      } else {
        // Real API call — show loading state only for network requests
        setLoading(true)
        const response = await fetch(`/api/tasks/${task.id}/details`)
        if (!response.ok) {
          throw new Error('Failed to fetch task details')
        }
        const data = await response.json()
        setTaskDetails(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load task details'))
      setTaskDetails(null)
    } finally {
      setLoading(false)
    }
  }, [useMockData])

  const closePanel = useCallback(() => {
    setSelectedTask(null)
    setTaskDetails(null)
    setError(null)
    setIsExpanded(false)
  }, [])

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  const toggleTask = useCallback(async (task: Task) => {
    if (selectedTask?.id === task.id) {
      closePanel()
    } else {
      await selectTask(task)
    }
  }, [selectedTask, selectTask, closePanel])

  return {
    selectedTask,
    taskDetails,
    loading,
    error,
    isPanelOpen: selectedTask !== null,
    isExpanded,
    selectTask,
    closePanel,
    toggleTask,
    toggleExpand,
  }
}
