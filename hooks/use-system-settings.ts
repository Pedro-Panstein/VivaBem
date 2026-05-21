"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SystemSettings {
  // General
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  maintenanceMessage: string
  
  // Appearance
  theme: "dark" | "light" | "system"
  primaryColor: string
  
  // Security
  allowRegistration: boolean
  requireEmailVerification: boolean
  sessionTimeout: number // minutes
  maxLoginAttempts: number
  
  // Notifications
  enableNotifications: boolean
  emailNotifications: boolean
  smsNotifications: boolean
}

interface SystemSettingsStore {
  settings: SystemSettings
  updateSettings: (updates: Partial<SystemSettings>) => void
  resetSettings: () => void
  isMaintenanceMode: () => boolean
}

const defaultSettings: SystemSettings = {
  siteName: "VivaBem",
  siteDescription: "Sistema de Monitoramento de Saude",
  maintenanceMode: false,
  maintenanceMessage: "O sistema esta em manutencao. Por favor, tente novamente mais tarde.",
  theme: "dark",
  primaryColor: "#22d3ee",
  allowRegistration: true,
  requireEmailVerification: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  enableNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
}

export const useSystemSettings = create<SystemSettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }))
      },
      
      resetSettings: () => {
        set({ settings: defaultSettings })
      },
      
      isMaintenanceMode: () => {
        return get().settings.maintenanceMode
      },
    }),
    {
      name: "vivabem-system-settings",
    }
  )
)
