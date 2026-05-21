'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDataStore } from '@/hooks/use-data-store';
import { useSystemSettings } from '@/hooks/use-system-settings';
import { useAuth } from '@/hooks/use-auth';
import { MaintenanceScreen } from '@/components/maintenance-screen';

export function DataInitializer({ children }: { children: React.ReactNode }) {
  const { initializeData } = useDataStore();
  const { settings } = useSystemSettings();
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Apply theme from settings
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else if (settings.theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.remove('light');
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  }, [settings.theme]);

  // Update document title with site name
  useEffect(() => {
    if (settings.siteName) {
      document.title = settings.siteName;
    }
  }, [settings.siteName]);

  // Check maintenance mode
  const isLoginPage = pathname === '/login';
  const isAdminUser = isAuthenticated && user?.tipo === 'ADMIN';
  const shouldShowMaintenance = settings.maintenanceMode && !isLoginPage && !isAdminUser;

  if (shouldShowMaintenance) {
    return <MaintenanceScreen />;
  }

  return <>{children}</>;
}
