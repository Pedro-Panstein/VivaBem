import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDataStore } from './hooks/use-data-store';
import { useSystemSettings } from './hooks/use-system-settings';
import { Toaster } from './components/ui/Toaster';
import MaintenanceScreen from './components/MaintenanceScreen';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PacientePage from './pages/PacientePage';
import MedicoPage from './pages/MedicoPage';
import AdminPage from './pages/AdminPage';

// Protected Route Component
import { useAuth } from './hooks/use-auth';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on user role
    const redirectPath = user.role === 'admin' ? '/admin' : user.role === 'medico' ? '/medico' : '/paciente';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const initializeData = useDataStore((state) => state.initializeData);
  const { settings } = useSystemSettings();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  if (settings.maintenanceMode) {
    return <MaintenanceScreen />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/paciente/*"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PacientePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/*"
          element={
            <ProtectedRoute allowedRoles={['medico']}>
              <MedicoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
