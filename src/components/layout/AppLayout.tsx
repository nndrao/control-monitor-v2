import type { ReactNode } from 'react'
import { Sun, Moon, Bell } from 'lucide-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAppContext } from '@/contexts/AppContext'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { theme, toggleTheme, userName } = useAppContext()

  // Get user initials for avatar
  const initials = userName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
        {/* Top Bar — spans full width above sidebar + content */}
        <div className="h-10 flex items-center justify-between px-4 flex-shrink-0" style={{ backgroundColor: '#d71e28' }}>
          {/* Left: App Name and Version */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white tracking-tight">
              Control Monitor
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20 text-white/90 font-medium">
              v2
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-white/15 text-white/80 hover:text-white transition-all duration-150"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* Notifications */}
            <button
              className="p-1.5 rounded-md hover:bg-white/15 text-white/80 hover:text-white transition-all duration-150"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* User Avatar */}
            <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-semibold">
              {initials}
            </div>
          </div>
        </div>

        {/* Below header: Sidebar + Content side by side */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
