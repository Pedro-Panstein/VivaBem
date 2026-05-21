"use client"

import { Sidebar, MobileMenuButton } from "./sidebar"
import { Navbar } from "./navbar"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  allowedRoles?: ("ADMIN" | "DOCTOR" | "PATIENT")[]
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  allowedRoles,
}: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [mounted, isAuthenticated, router])

  useEffect(() => {
    if (mounted && user && allowedRoles && !allowedRoles.includes(user.tipo)) {
      const redirectPath = user.tipo === "ADMIN" ? "/admin" : user.tipo === "DOCTOR" ? "/medico" : "/paciente"
      router.push(redirectPath)
    }
  }, [mounted, user, allowedRoles, router])

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
          <div className="absolute inset-0 h-16 w-16 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
        </div>
      </div>
    )
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} isMobile={isMobile} />
      
      <div className={`transition-all duration-300 ${!isMobile && sidebarOpen ? "lg:pl-64" : !isMobile ? "lg:pl-20" : ""}`}>
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 flex items-center gap-4 border-b border-cyan-500/20 bg-background/80 backdrop-blur-lg px-4 py-3 lg:hidden">
          <MobileMenuButton onClick={toggleSidebar} />
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
        </div>
        
        {/* Desktop Navbar */}
        <div className="hidden lg:block">
          <Navbar title={title} subtitle={subtitle} />
        </div>
        
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
