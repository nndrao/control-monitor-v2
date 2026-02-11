/**
 * Task Details Generator
 *
 * Generates mock data for task details panel including notes, files, and additional info.
 * Uses seeded random for deterministic results per task ID.
 */

import { SeededRandom } from './seededRandom'
import { getControlInstructions } from '@/utils/controlInstructions'
import type {
  TaskDetails,
  TaskNote,
  TaskFile,
  AdditionalInfoRow
} from '@/types/task-details.types'

// Note authors with avatar initials
const NOTE_AUTHORS = [
  { name: 'Sumit Sharma', avatar: 'SS' },
  { name: 'Matthew Bonner', avatar: 'MB' },
  { name: 'Sarah Mitchell', avatar: 'SM' },
  { name: 'Emma Johnson', avatar: 'EJ' },
  { name: 'Michael Chen', avatar: 'MC' },
  { name: 'David Williams', avatar: 'DW' },
  { name: 'Jennifer Lopez', avatar: 'JL' },
  { name: 'Hong Ray', avatar: 'HR' },
]

const NOTE_CONTENTS = [
  '@Hong, Ray (RFI) test',
  'note1',
  'Verified all reconciliation reports. Numbers match within acceptable tolerance.',
  'Escalated to senior management for review due to unusual variance.',
  'Pending additional documentation from the trading desk.',
  'All required approvals have been obtained. Ready for sign-off.',
  'Identified discrepancy in source data. Investigating root cause.',
  'Completed preliminary review. Follow-up scheduled for tomorrow.',
  'Requested clarification from counterparty on settlement terms.',
  'Updated status based on latest market data refresh.',
  'Cross-checked with compliance team. No issues identified.',
  'Documented exception and obtained management approval to proceed.',
]

const FILE_TEMPLATES = [
  { name: 'Holiday_List_India_2026.pdf', type: 'application/pdf' },
  { name: 'PG2352_PlanPrint.pdf', type: 'application/pdf' },
  { name: 'test_3_n6ici3l.msg', type: 'application/vnd.ms-outlook' },
  { name: 'reconciliation_report.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { name: 'trade_confirmation.pdf', type: 'application/pdf' },
  { name: 'supporting_evidence.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { name: 'screenshot.png', type: 'image/png' },
  { name: 'audit_trail.csv', type: 'text/csv' },
]

const TRADER_NAMES = [
  'Edward John William Coulson',
  'John Smith',
  'Alice Wong',
  'Robert Chen',
  'Maria Garcia',
  'James Wilson',
]

const TRADER_ENTS = ['k007888', 'k001234', 'k005678', 'k009012', 'k003456']

/**
 * Generate notes for a task
 */
function generateNotes(rng: SeededRandom, taskId: string): TaskNote[] {
  const notes: TaskNote[] = []

  // 80% chance of having notes
  if (!rng.boolean(0.8)) {
    return notes
  }

  const noteCount = rng.nextInt(1, 4)

  for (let i = 0; i < noteCount; i++) {
    const author = rng.pick(NOTE_AUTHORS)
    const daysAgo = rng.nextInt(0, 30)
    const hoursAgo = rng.nextInt(0, 23)
    const minutesAgo = rng.nextInt(0, 59)

    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - daysAgo)
    timestamp.setHours(timestamp.getHours() - hoursAgo)
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo)

    notes.push({
      id: `note-${taskId}-${i}`,
      author: author.name,
      avatar: author.avatar,
      content: rng.pick(NOTE_CONTENTS),
      timestamp: timestamp.toISOString(),
      approved: rng.boolean(0.3),
    })
  }

  // Sort by timestamp (newest first)
  return notes.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

/**
 * Generate files for a task
 */
function generateFiles(rng: SeededRandom, taskId: string, fileCount: number): TaskFile[] {
  const files: TaskFile[] = []

  if (fileCount === 0) {
    return files
  }

  const usedTemplates = new Set<number>()

  for (let i = 0; i < fileCount; i++) {
    // Get unique file template
    let templateIndex: number
    do {
      templateIndex = rng.nextInt(0, FILE_TEMPLATES.length - 1)
    } while (usedTemplates.has(templateIndex) && usedTemplates.size < FILE_TEMPLATES.length)
    usedTemplates.add(templateIndex)

    const template = FILE_TEMPLATES[templateIndex]
    const daysAgo = rng.nextInt(0, 14)

    const uploadedAt = new Date()
    uploadedAt.setDate(uploadedAt.getDate() - daysAgo)

    files.push({
      id: `file-${taskId}-${i}`,
      name: template.name,
      type: template.type,
      size: rng.nextInt(10000, 5000000), // 10KB - 5MB
      uploadedAt: uploadedAt.toISOString(),
      uploadedBy: rng.pick(NOTE_AUTHORS).name,
    })
  }

  // Sort by upload date (newest first)
  return files.sort((a, b) =>
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  )
}

/**
 * Generate additional info rows for a task
 */
function generateAdditionalInfo(rng: SeededRandom, taskId: string): AdditionalInfoRow[] {
  const rows: AdditionalInfoRow[] = []
  const rowCount = rng.nextInt(3, 8)

  // Extract numeric part from task ID for display
  const taskIdNum = taskId.replace(/\D/g, '') || '12816'

  for (let i = 0; i < rowCount; i++) {
    rows.push({
      id: `2303501661900000${String(i).padStart(2, '0')}`,
      taskId: taskIdNum,
      sourceAlertId: 'A-2023-02-06-00037',
      trader: rng.pick(TRADER_NAMES),
      traderEnt: rng.pick(TRADER_ENTS),
    })
  }

  return rows
}

/**
 * Generate complete task details for a task
 */
export function generateTaskDetails(task: {
  id: string
  title: string
  description?: string
  category?: string
  controlName?: string
  controlType?: string
  fileCount?: number
}): TaskDetails {
  const rng = new SeededRandom(task.id)

  const category = task.category || 'Trade Surveillance Alert'
  const controlInstructions = getControlInstructions(category)

  return {
    id: task.id,
    title: task.title,
    description: task.description || `FrontRunning alert for ${rng.pick(TRADER_NAMES)}, ${rng.pick(TRADER_ENTS)}, 3Y, RATES, UST, EMEA, 00002058048, 51826008. A trader executed orders to BUY with the total size of 105.0000 and the total value of 10,454.2695 before the execution of the client 44106397 order at 2023-02-06 09:13:24.408. The size of the client execution was 100.0000 and the value was 9,957.0312.`,
    category,
    controlName: task.controlName || 'Trade Pattern Analysis',
    controlType: task.controlType || 'Surveillance',
    notes: generateNotes(rng, task.id),
    files: generateFiles(rng, task.id, task.fileCount || rng.nextInt(0, 4)),
    additionalInfo: generateAdditionalInfo(rng, task.id),
    controlInstructions,
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Format relative time for display
 */
export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Format full timestamp for display
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
