import type { ReactNode } from 'react'

interface PageHeaderProps {
  /** Primary label shown after any leading actions */
  subtitle?: string
  /** Content rendered on the left, before the subtitle */
  leading?: ReactNode
  /** Content rendered in the center area (e.g. status chips) */
  center?: ReactNode
  /** Content rendered on the right (search, actions, etc.) */
  children?: ReactNode
}

export function PageHeader({ subtitle, leading, center, children }: PageHeaderProps) {
  return (
    <div className="h-12 px-3 border-b border-border bg-card flex-shrink-0 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
      <div className="flex items-center h-full gap-3">
        {/* Left zone: leading action + view name */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {leading}
          {subtitle && (
            <>
              <div className="w-px h-4 bg-border" />
              <h1 className="text-[13px] font-semibold text-foreground whitespace-nowrap">
                {subtitle}
              </h1>
            </>
          )}
        </div>

        {/* Center zone: status chips */}
        {center && (
          <div className="flex-1 flex items-center justify-center min-w-0">
            {center}
          </div>
        )}

        {/* Spacer if no center content */}
        {!center && <div className="flex-1" />}

        {/* Right zone: search, buttons, actions */}
        {children && (
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
