import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Network } from 'lucide-react'
import { AppProvider } from '@/contexts/AppContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { TaskManager } from '@/components/tasks/TaskManager'

function AppRoot() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks/all" replace />} />
        <Route path="/tasks/:viewId" element={<TaskManager />} />
        <Route
          path="/hierarchy"
          element={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Network className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-foreground">
                  Control Hierarchy
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Hierarchy view coming soon
                </p>
              </div>
            </div>
          }
        />
        <Route
          path="/example-form"
          element={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground">
                  Form Page
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Forms implementation coming soon
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </AppLayout>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoot />
      </AppProvider>
    </HashRouter>
  )
}
