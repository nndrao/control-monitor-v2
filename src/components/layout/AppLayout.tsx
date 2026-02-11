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
        {/* Top Bar — refined gradient for a more sophisticated look */}
        <div
          className="h-10 flex items-center justify-between px-4 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #c41a22 0%, #d71e28 50%, #b8171f 100%)' }}
        >
          {/* Left: App Name and Version */}
          <div className="flex items-center gap-2.5">
            <span className="text-body font-semibold text-white tracking-tight">
              Control Monitor
            </span>
            <span className="text-caption px-1.5 py-0.5 rounded-full bg-white/15 text-white/90 font-medium">
              v2
            </span>
          </div>

          {/* Right: Actions — consistent gap and sizing */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-white/15 text-white/80 hover:text-white transition-colors duration-150"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            <button
              className="p-1.5 rounded-md hover:bg-white/15 text-white/80 hover:text-white transition-colors duration-150"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>

            <div className="w-px h-5 bg-white/20 mx-1" />

            <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-caption font-semibold cursor-pointer hover:bg-white/30 transition-colors duration-150">
              {initials}
            </div>
          </div>
        </div>

        {/* Below header: Sidebar + Content side by side */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
