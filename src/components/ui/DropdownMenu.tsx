import React, { useState, useRef, useEffect } from 'react'

interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
}

export function DropdownMenu({ children, className = '' }: DropdownMenuProps) {
  return <div className={`relative inline-block ${className}`}>{children}</div>
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  onClick?: () => void
}

export function DropdownMenuTrigger({ children, onClick }: DropdownMenuTriggerProps) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function DropdownMenuContent({ children, isOpen, onClose, align = 'end', className = '' }: DropdownMenuContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const alignStyle = {
    start: { left: 0 },
    center: { left: '50%', transform: 'translateX(-50%)' },
    end: { right: 0 },
  }

  return (
    <div
      ref={ref}
      className={`dropdown-content ${className}`}
      style={{ position: 'absolute', top: '100%', marginTop: '4px', ...alignStyle[align] }}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function DropdownMenuItem({ children, onClick, disabled = false, className = '' }: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      className={`dropdown-item ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

interface DropdownMenuSeparatorProps {
  className?: string
}

export function DropdownMenuSeparator({ className = '' }: DropdownMenuSeparatorProps) {
  return <div className={`dropdown-separator ${className}`} />
}

interface DropdownMenuLabelProps {
  children: React.ReactNode
  className?: string
}

export function DropdownMenuLabel({ children, className = '' }: DropdownMenuLabelProps) {
  return <div className={`dropdown-label ${className}`}>{children}</div>
}
