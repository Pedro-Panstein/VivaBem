"use client"

import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Stethoscope,
  Activity,
  FileText,
  Settings,
  LogOut,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const menuItems = {
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Usuários", href: "/admin/usuarios" },
    { icon: Stethoscope, label: "Médicos", href: "/admin/medicos" },
    { icon: UserCog, label: "Pacientes", href: "/admin/pacientes" },
    { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
  ],
  medico: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/medico" },
    { icon: Users, label: "Meus Pacientes", href: "/medico/pacientes" },
    { icon: FileText, label: "Registros", href: "/medico/registros" },
    { icon: Activity, label: "Monitoramento", href: "/medico/monitoramento" },
  ],
  paciente: [
    { icon: LayoutDashboard, label: "Minha Saúde", href: "/paciente" },
    { icon: Heart, label: "Corpo Humano", href: "/paciente/corpo" },
    { icon: FileText, label: "Histórico", href: "/paciente/historico" },
    { icon: Activity, label: "Recomendações", href: "/paciente/recomendacoes" },
  ],
}

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) return null

  const roleKey = user.tipo === "ADMIN" ? "admin" : user.tipo === "DOCTOR" ? "medico" : "paciente"
  const items = menuItems[roleKey]

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen glass-card border-r border-cyan-500/20 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-cyan-500/20 px-4">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 blur-sm" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
                  <Heart className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-gradient">VivaBem</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 neon-border"
                    : "text-muted-foreground hover:bg-cyan-500/10 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-cyan-400")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-cyan-500/20 p-4">
          <div className={cn("mb-4 flex items-center gap-3", collapsed && "justify-center")}>
            <div className="relative h-10 w-10 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-sm opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-500/30">
                <span className="text-sm font-bold text-cyan-400">
                  {user.nome.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">{user.nome}</p>
                <p className="truncate text-xs text-muted-foreground capitalize">{roleKey}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}
