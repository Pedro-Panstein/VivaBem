import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SystemSettings } from '../types'

interface SystemSettingsStore {
  settings: SystemSettings
  updateSettings: (settings: Partial<SystemSettings>) => void
}

const defaultSettings: SystemSettings = {
  maintenanceMode: false,
  maintenanceMessage: 'O sistema está em manutenção. Por favor, tente novamente mais tarde.',
  systemName: 'VivaBem',
  allowRegistrations: true,
  maxUsersPerDoctor: 50,
}

export const useSystemSettings = create<SystemSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'vivabem-system-settings',
    }
  )
)
