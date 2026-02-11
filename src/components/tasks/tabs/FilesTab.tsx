/**
 * FilesTab Component
 *
 * Display task files in a clean list with icons, names, and metadata.
 * File types are color-coded (PDF red, Excel green, images blue, etc).
 * Hover effects for interactivity without being intrusive.
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  Mail,
} from 'lucide-react'
import type { TaskFile } from '@/types/task-details.types'

interface FilesTabProps {
  files: TaskFile[]
  className?: string
}

/**
 * File type icon mapping
 */
const FILE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'application/pdf': FileText,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    FileSpreadsheet,
  'application/vnd.ms-excel': FileSpreadsheet,
  'text/csv': FileSpreadsheet,
  'image/png': FileImage,
  'image/jpeg': FileImage,
  'image/gif': FileImage,
  'image/webp': FileImage,
  'application/vnd.ms-outlook': Mail,
  'message/rfc822': Mail,
}

/**
 * File type color mapping
 */
const FILE_COLORS: Record<string, string> = {
  'application/pdf': 'text-red-500',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    'text-green-600',
  'application/vnd.ms-excel': 'text-green-600',
  'text/csv': 'text-green-600',
  'image/png': 'text-blue-500',
  'image/jpeg': 'text-blue-500',
  'image/gif': 'text-blue-500',
  'image/webp': 'text-blue-500',
  'application/vnd.ms-outlook': 'text-blue-600',
}

/**
 * Get appropriate icon for file type
 */
function getFileIcon(type: string) {
  return FILE_ICONS[type] || File
}

/**
 * Get appropriate color for file type
 */
function getFileColor(type: string) {
  return FILE_COLORS[type] || 'text-muted-foreground'
}

/**
 * Format file size for display
 */
function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k))
  const value = (sizeInBytes / Math.pow(k, i)).toFixed(1)
  return `${value} ${sizes[i]}`
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

/**
 * File Item Component
 */
const FileItem = memo(function FileItem({ file }: { file: TaskFile }) {
  const Icon = getFileIcon(file.type)
  const iconColor = getFileColor(file.type)

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Download file:', file.name, file.id)
    // TODO: Implement actual file download
  }

  return (
    <button
      onClick={handleDownload}
      className={cn(
        'w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left',
        'hover:bg-muted/30 transition-colors duration-150'
      )}
    >
      <Icon
        className={cn('h-4 w-4 flex-shrink-0 mt-0.5', iconColor)}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate hover:underline">
          {file.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <span className="text-border">·</span>
          <span>{file.uploadedBy}</span>
          <span className="text-border">·</span>
          <span>{formatDate(file.uploadedAt)}</span>
        </div>
      </div>
    </button>
  )
})

export const FilesTab = memo(function FilesTab({
  files,
  className,
}: FilesTabProps) {
  if (!files || files.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">No files attached</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', className)}>
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  )
})
