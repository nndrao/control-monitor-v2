/**
 * useTaskData Hook
 *
 * Custom hook for fetching task data from either mock data or REST API
 * based on the useMockData flag in AppContext.
 */

import { useState, useEffect, useCallback } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import mockTasksData from '@/mockData/tasks.json'

export interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueStatus: string
  category: string
  controlName: string
  controlType: string
  controlTypeId: number
  assignedTo: string
  responsibleEmployee: string
  dueDate: string
  createdDate: string
  completedDate?: string
  workflowStepStatus: string
  workflowStep: string
  workflowType: string
  workflowName: string
  riskBunner: string
  groupName: string
  groupId: number
  stepId: number
  taskPathId: number
  stepNumber: number
  taskActivityId: number
  taskType: number
  taskHierarchy: string[]
  taskStateAssignment: string
  alertText: string
  daysOverdue?: number
  fileCount: number
  note: string
}

export interface UseTaskDataResult {
  tasks: Task[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

const API_ENDPOINT = 'https://api.example.com/tasks'

/**
 * Returns the percentage of tasks to show for each filter type.
 * Different percentages create variety in subset sizes.
 */
function getSubsetPercentage(filterType: string): number {
  const percentages: Record<string, number> = {
    'user-only': 0.15,
    'pending-others': 0.05,
    'watcher': 0.10,
    'rfi': 0.08,
    'team': 0.20,
    'extended-team': 0.30,
    'delegated-out': 0.05,
    'delegated-in': 0.08,
    'profile': 0.18,
  }

  return percentages[filterType] || 0.25
}

/**
 * Returns a deterministic random subset of tasks.
 * Uses seed for consistent results per filter type.
 */
function getRandomSubset(tasks: Task[], percentage: number, seed?: string): Task[] {
  const seededRandom = seed
    ? () => {
        let hash = 0
        for (let i = 0; i < seed.length; i++) {
          hash = ((hash << 5) - hash) + seed.charCodeAt(i)
          hash = hash & hash
        }
        const x = Math.sin(hash++) * 10000
        return x - Math.floor(x)
      }
    : Math.random

  const count = Math.floor(tasks.length * percentage)
  const shuffled = [...tasks].sort(() => seededRandom() - 0.5)
  return shuffled.slice(0, count)
}

export function useTaskData(filterType?: string): UseTaskDataResult {
  const { useMockData } = useAppContext()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let allTasks: Task[] = []

      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 500))
        allTasks = mockTasksData as Task[]
      } else {
        const endpoint = filterType && filterType !== 'all'
          ? `${API_ENDPOINT}/${filterType}`
          : API_ENDPOINT

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        allTasks = data.tasks || []
      }

      const filteredTasks = useMockData && filterType && filterType !== 'all'
        ? getRandomSubset(allTasks, getSubsetPercentage(filterType), filterType)
        : allTasks

      setTasks(filteredTasks)
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('Failed to fetch tasks')
      setError(fetchError)
      console.error('Error fetching tasks:', fetchError)
    } finally {
      setLoading(false)
    }
  }, [useMockData, filterType])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  }
}
