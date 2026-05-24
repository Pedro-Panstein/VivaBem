import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDataStore } from './hooks/use-data-store'
import { useSystemSettings } from './hooks/use-system-settings'
import { Toaster } from './components/ui/Toaster'
import MaintenanceScreen from './components/MaintenanceScreen'

// Pages
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import CadastroPage from './pages/Cadastro'
import PacientePage from './pages/Paciente'
import MedicoPage from './pages/Medico'
import AdminPage from './pages/Admin'

// Protected Route Component
import { useAuth } from './hooks/use-auth'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

function App() {
  const initializeData = useDataStore((state) => state.initializeData)
  const { settings } = useSystemSettings()

  useEffect(() => {
    initializeData()
  }, [initializeData])

  if (settings.maintenanceMode) {
    return <MaintenanceScreen />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route
          path="/paciente"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PacientePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico"
          element={
            <ProtectedRoute allowedRoles={['medico']}>
              <MedicoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
