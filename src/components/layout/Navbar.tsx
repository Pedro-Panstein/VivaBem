import React, { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuth } from '../../hooks/use-auth'
import { useDataStore } from '../../hooks/use-data-store'

interface NavbarProps {
  onMenuClick?: () => void
  title?: string
}

export function Navbar({ onMenuClick, title }: NavbarProps) {
  const { user } = useAuth()
  const notificacoes = useDataStore((state) => state.notificacoes)
  
  const unreadCount = user 
    ? notificacoes.filter((n) => n.userId === user.id && !n.lida).length
    : 0

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Button
          variant="ghost"
          size="icon"
          className="menu-toggle"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </Button>
        {title && <h1 className="navbar-title">{title}</h1>}
      </div>

      <div className="navbar-right">
        <div style={{ position: 'relative', maxWidth: '300px', display: 'none' }} className="md:block">
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
          <Input
            type="search"
            placeholder="Buscar..."
            style={{ paddingLeft: '36px', width: '200px' }}
          />
        </div>
        
        <Button variant="ghost" size="icon" style={{ position: 'relative' }}>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="navbar-notification-badge" />
          )}
        </Button>
      </div>
    </header>
  )
}
