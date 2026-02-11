/**
 * FilesTab Component
 *
 * Enhanced empty state with icon and CTA.
 * Consistent typography tokens and hover patterns.
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  Mail,
  Paperclip,
} from 'lucide-react'
import type { TaskFile } from '@/types/task-details.types'

interface FilesTabProps {
  files: TaskFile[]
  className?: string
}

const FILE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'application/pdf': FileText,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileSpreadsheet,
  'application/vnd.ms-excel': FileSpreadsheet,
  'text/csv': FileSpreadsheet,
  'image/png': FileImage,
  'image/jpeg': FileImage,
  'image/gif': FileImage,
  'image/webp': FileImage,
  'application/vnd.ms-outlook': Mail,
  'message/rfc822': Mail,
}

const FILE_COLORS: Record<string, string> = {
  'application/pdf': 'text-red-500',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'text-green-600',
  'application/vnd.ms-excel': 'text-green-600',
  'text/csv': 'text-green-600',
  'image/png': 'text-blue-500',
  'image/jpeg': 'text-blue-500',
  'image/gif': 'text-blue-500',
  'image/webp': 'text-blue-500',
  'application/vnd.ms-outlook': 'text-blue-600',
}

function getFileIcon(type: string) {
  return FILE_ICONS[type] || File
}

function getFileColor(type: string) {
  return FILE_COLORS[type] || 'text-muted-foreground'
}

function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k))
  const value = (sizeInBytes / Math.pow(k, i)).toFixed(1)
  return `${value} ${sizes[i]}`
}

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

const FileItem = memo(function FileItem({ file }: { file: TaskFile }) {
  const Icon = getFileIcon(file.type)
  const iconColor = getFileColor(file.type)

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Download file:', file.name, file.id)
  }

  return (
    <button
      onClick={handleDownload}
      className={cn(
        'w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left',
        'hover-list-item'
      )}
    >
      <Icon className={cn('h-4 w-4 flex-shrink-0 mt-0.5', iconColor)} />
      <div className="flex-1 min-w-0">
        <p className="text-body font-medium text-foreground truncate hover:underline">
          {file.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-caption text-muted-foreground">
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
          <Paperclip className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-body font-medium text-foreground">No files attached</p>
        <p className="text-caption text-muted-foreground mt-1">
          File attachments will appear here
        </p>
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
