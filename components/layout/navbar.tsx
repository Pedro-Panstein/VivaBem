"use client"

import { useAuth } from "@/hooks/use-auth"
import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface NavbarProps {
  title: string
  subtitle?: string
}

export function Navbar({ title, subtitle }: NavbarProps) {
  const { user } = useAuth()
  const roleLabel = user?.tipo === "ADMIN" ? "Administrador" : user?.tipo === "DOCTOR" ? "Médico" : "Paciente"

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-cyan-500/20 bg-background/80 px-6 backdrop-blur-xl"
    >
      <div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="w-64 border-cyan-500/20 bg-background/50 pl-10 focus:border-cyan-500/50"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-400 pulse-glow" />
        </Button>

        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.nome}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-sm opacity-50" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-500/30">
              <span className="text-sm font-bold text-cyan-400">
                {user?.nome?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </motion.header>
  )
}
