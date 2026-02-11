/**
 * NotesTab Component
 *
 * Display task notes in a clean Notion-like list.
 * Each note shows author avatar, name, timestamp, and content.
 * Generous spacing between notes for a breathable layout.
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { TaskNote } from '@/types/task-details.types'

interface NotesTabProps {
  notes: TaskNote[]
  className?: string
}

const AVATAR_COLORS = [
  'bg-pink-500',
  'bg-purple-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-indigo-500',
]

/**
 * Consistent avatar color based on author name
 */
function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp: string): string {
  if (!timestamp) return ''
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  } catch {
    return timestamp
  }
}

/**
 * Note Item Component
 */
const NoteItem = memo(function NoteItem({ note }: { note: TaskNote }) {
  const avatarColor = getAvatarColor(note.author)

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
        <AvatarFallback
          className={cn('text-[10px] font-medium text-white', avatarColor)}
        >
          {note.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {note.author}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(note.timestamp)}
          </span>
        </div>
        <p className="text-sm text-foreground leading-relaxed mt-1">
          {note.content}
        </p>
      </div>
    </div>
  )
})

export const NotesTab = memo(function NotesTab({
  notes,
  className,
}: NotesTabProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">No notes yet</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {notes.map((note) => (
        <div key={note.id}>
          <NoteItem note={note} />
          {note !== notes[notes.length - 1] && (
            <div className="mt-4 border-b border-border/50" />
          )}
        </div>
      ))}
    </div>
  )
})
