import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
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
      <div className="dialog-overlay" onClick={() => onOpenChange(false)} />
      {children}
    </>
  )
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
  onClose?: () => void
}

export function DialogContent({ children, className = '', onClose }: DialogContentProps) {
  return (
    <div className={`dialog-content ${className}`}>
      {onClose && (
        <button className="dialog-close" onClick={onClose}>
          <X size={16} />
          <span className="sr-only">Fechar</span>
        </button>
      )}
      {children}
    </div>
  )
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

export function DialogHeader({ children, className = '' }: DialogHeaderProps) {
  return <div className={`dialog-header ${className}`}>{children}</div>
}

interface DialogFooterProps {
  children: React.ReactNode
  className?: string
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return <div className={`dialog-footer ${className}`}>{children}</div>
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return <h2 className={`dialog-title ${className}`}>{children}</h2>
}

interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  return <p className={`dialog-description ${className}`}>{children}</p>
}
