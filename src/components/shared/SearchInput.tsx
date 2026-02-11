/**
 * Search Input Component
 *
 * Clean, compact search input for toolbar use.
 * Uses consistent h-7 (28px) compact height token.
 */

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative group', className)}>
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full h-7 pl-7 pr-7 text-label rounded-md transition-all',
          'bg-muted/50 border border-border/50 text-foreground',
          'placeholder:text-muted-foreground/70',
          'hover:border-border',
          'focus:bg-background focus:border-ring/40 focus:ring-1 focus:ring-ring/20 focus:outline-none'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center rounded hover:bg-muted transition-colors group/clear"
          aria-label="Clear search"
        >
          <X className="h-3 w-3 text-muted-foreground group-hover/clear:text-foreground" />
        </button>
      )}
    </div>
  )
}
