import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Heart,
  Home,
  Calendar,
  FileText,
  Pill,
  User,
  Settings,
  LogOut,
  Users,
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../hooks/use-auth'
import { Button } from '../ui/Button'
import { Avatar, AvatarFallback } from '../ui/Avatar'

interface SidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  roles: string[]
}

const navItems: NavItem[] = [
  { icon: <Home size={20} />, label: 'Dashboard', href: '/paciente', roles: ['paciente'] },
  { icon: <Activity size={20} />, label: 'Meus Sintomas', href: '/paciente?tab=sintomas', roles: ['paciente'] },
  { icon: <Calendar size={20} />, label: 'Consultas', href: '/paciente?tab=consultas', roles: ['paciente'] },
  { icon: <Pill size={20} />, label: 'Medicamentos', href: '/paciente?tab=medicamentos', roles: ['paciente'] },
  { icon: <FileText size={20} />, label: 'Exames', href: '/paciente?tab=exames', roles: ['paciente'] },
  
  { icon: <Home size={20} />, label: 'Dashboard', href: '/medico', roles: ['medico'] },
  { icon: <Users size={20} />, label: 'Pacientes', href: '/medico?tab=pacientes', roles: ['medico'] },
  { icon: <Calendar size={20} />, label: 'Agenda', href: '/medico?tab=agenda', roles: ['medico'] },
  { icon: <Activity size={20} />, label: 'Sintomas', href: '/medico?tab=sintomas', roles: ['medico'] },
  
  { icon: <Home size={20} />, label: 'Dashboard', href: '/admin', roles: ['admin'] },
  { icon: <Users size={20} />, label: 'Usuários', href: '/admin?tab=usuarios', roles: ['admin'] },
  { icon: <BarChart3 size={20} />, label: 'Relatórios', href: '/admin?tab=relatorios', roles: ['admin'] },
  { icon: <Settings size={20} />, label: 'Configurações', href: '/admin?tab=configuracoes', roles: ['admin'] },
]

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  const location = useLocation()
  const { user, logout } = useAuth()

  if (!user) return null

  const filteredItems = navItems.filter((item) => item.roles.includes(user.role))
  const initials = user.nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Heart size={20} />
        </div>
        {!collapsed && (
          <span className="sidebar-brand">
            Viva<span>Bem</span>
          </span>
        )}
        {onCollapsedChange && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapsedChange(!collapsed)}
            style={{ marginLeft: 'auto' }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {filteredItems.map((item) => {
            const isActive = location.pathname + location.search === item.href ||
              (location.pathname === item.href.split('?')[0] && !location.search && !item.href.includes('?'))
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <Avatar size="md">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.nome}</div>
              <div className="sidebar-user-email">{user.email}</div>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={logout}
          style={{ width: '100%', marginTop: '0.5rem', justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <LogOut size={18} />
          {!collapsed && <span style={{ marginLeft: '0.5rem' }}>Sair</span>}
        </Button>
      </div>
    </div>
  )
}
