/**
 * NotesTab Component
 *
 * Enhanced empty state with icon and CTA.
 * Consistent typography tokens and border styling.
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare } from 'lucide-react'
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

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

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

const NoteItem = memo(function NoteItem({ note }: { note: TaskNote }) {
  const avatarColor = getAvatarColor(note.author)

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
        <AvatarFallback
          className={cn('text-caption font-medium text-white', avatarColor)}
        >
          {note.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-body font-medium text-foreground">
            {note.author}
          </span>
          <span className="text-caption text-muted-foreground">
            {formatTimestamp(note.timestamp)}
          </span>
        </div>
        <p className="text-body text-foreground leading-relaxed mt-1">
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-body font-medium text-foreground">No notes yet</p>
        <p className="text-caption text-muted-foreground mt-1">
          Notes and comments will appear here
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {notes.map((note, idx) => (
        <div key={note.id}>
          <NoteItem note={note} />
          {idx < notes.length - 1 && (
            <div className="mt-4 border-b border-border/50" />
          )}
        </div>
      ))}
    </div>
  )
})
