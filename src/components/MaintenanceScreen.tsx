import React from 'react'
import { Wrench } from 'lucide-react'
import { useSystemSettings } from '../hooks/use-system-settings'

export default function MaintenanceScreen() {
  const { settings } = useSystemSettings()

  return (
    <div className="maintenance-screen">
      <Wrench className="maintenance-icon" />
      <h1 className="maintenance-title">Sistema em Manutenção</h1>
      <p className="maintenance-description">
        {settings.maintenanceMessage || 'O sistema está em manutenção. Por favor, tente novamente mais tarde.'}
      </p>
    </div>
  )
}
