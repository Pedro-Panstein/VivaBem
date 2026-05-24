import React from 'react'
import { useToast } from '../../hooks/use-toast'
import { X } from 'lucide-react'

export function Toaster() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="toast-viewport">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type === 'success' ? 'toast-success' : ''} ${toast.type === 'error' ? 'toast-error' : ''}`}
        >
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            {toast.title && <div className="toast-title">{toast.title}</div>}
            {toast.description && <div className="toast-description">{toast.description}</div>}
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
