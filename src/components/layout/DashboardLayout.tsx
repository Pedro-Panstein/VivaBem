import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useIsMobile } from '../../hooks/use-mobile'
import { Sheet, SheetContent } from '../ui/Sheet'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className="dashboard-layout">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
          style={{ width: sidebarCollapsed ? '4.5rem' : '16rem' }}
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" onClose={() => setMobileMenuOpen(false)} className="p-0" style={{ padding: 0 }}>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="dashboard-main">
        <Navbar
          onMenuClick={() => setMobileMenuOpen(true)}
          title={title}
        />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  )
}
