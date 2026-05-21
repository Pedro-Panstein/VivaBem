"use client"

import { Sidebar } from "./sidebar"
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64 transition-all duration-300">
        <Navbar title={title} subtitle={subtitle} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
