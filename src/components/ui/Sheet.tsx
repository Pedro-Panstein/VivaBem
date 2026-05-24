import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <>
      <div className="sheet-overlay" onClick={() => onOpenChange(false)} />
      {children}
    </>
  )
}

interface SheetContentProps {
  children: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
  onClose?: () => void
}

export function SheetContent({ children, side = 'right', className = '', onClose }: SheetContentProps) {
  const sideClasses: Record<string, string> = {
    left: 'sheet-content-left',
    right: 'sheet-content-right',
    top: 'sheet-content-top',
    bottom: 'sheet-content-bottom',
  }

  return (
    <div className={`sheet-content ${sideClasses[side]} ${className}`}>
      {onClose && (
        <button className="sheet-close" onClick={onClose}>
          <X size={16} />
          <span className="sr-only">Fechar</span>
        </button>
      )}
      {children}
    </div>
  )
}

interface SheetHeaderProps {
  children: React.ReactNode
  className?: string
}

export function SheetHeader({ children, className = '' }: SheetHeaderProps) {
  return <div className={`sheet-header ${className}`}>{children}</div>
}

interface SheetTitleProps {
  children: React.ReactNode
  className?: string
}

export function SheetTitle({ children, className = '' }: SheetTitleProps) {
  return <h2 className={`sheet-title ${className}`}>{children}</h2>
}

interface SheetDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function SheetDescription({ children, className = '' }: SheetDescriptionProps) {
  return <p className={`sheet-description ${className}`}>{children}</p>
}
