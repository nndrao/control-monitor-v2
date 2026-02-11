/**
 * Sidebar Component
 *
 * Responsive icon-rail navigation.
 * - Desktop (>=1024px): 64px icon rail with labels
 * - Tablet (768-1023px): 48px compact icon-only rail
 * - Consistent spacing and icon sizes throughout
 */

import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Network, ListChecks, LayoutDashboard } from 'lucide-react'

interface NavItemProps {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  isActive: boolean
}

function NavItem({ to, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={to} className="block">
          <div
            className={cn(
              'relative flex flex-col items-center justify-center gap-0.5 py-2 rounded-md cursor-pointer overflow-hidden',
              'transition-colors duration-150',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )}
          >
            {/* Active indicator bar */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />
            )}
            <Icon className={cn('h-4 w-4 flex-shrink-0', isActive && 'text-primary')} />
            <span className={cn(
              'text-[9px] font-medium text-center leading-tight truncate w-full px-0.5 hidden desktop:block',
              isActive && 'text-primary font-semibold'
            )}>
              {label}
            </span>
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export function Sidebar() {
  const location = useLocation()

  const isTaskRoute = location.pathname.startsWith('/tasks/')
  const isHierarchyRoute = location.pathname.startsWith('/hierarchy')

  return (
    <aside className="w-12 desktop:w-16 bg-card border-r border-border flex flex-col flex-shrink-0 transition-all duration-200">
      {/* Main navigation */}
      <nav className="flex-1 py-2 px-1 desktop:px-1.5">
        <div className="space-y-1">
          <NavItem
            to="/tasks/all"
            icon={ListChecks}
            label="Tasks"
            isActive={isTaskRoute}
          />
          <NavItem
            to="/hierarchy"
            icon={Network}
            label="Hierarchy"
            isActive={isHierarchyRoute}
          />
        </div>
      </nav>

      {/* Bottom section */}
      <div className="py-2 px-1 desktop:px-1.5 border-t border-border">
        <NavItem
          to="/example-form"
          icon={LayoutDashboard}
          label="Forms"
          isActive={location.pathname === '/example-form'}
        />
      </div>
    </aside>
  )
}
