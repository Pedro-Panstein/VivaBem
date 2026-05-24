import { create } from 'zustand'
import type { Toast, ToastType } from '../types'

interface ToastStore {
  toasts: Toast[]
  addToast: (title: string, description?: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (title, description, type = 'info') => {
    const id = `toast-${Date.now()}`
    const toast: Toast = { id, title, description, type }
    
    set((state) => ({ toasts: [...state.toasts, toast] }))
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 5000)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

// Helper hook for common toast actions
export function useToastActions() {
  const addToast = useToast((state) => state.addToast)
  
  return {
    success: (title: string, description?: string) => addToast(title, description, 'success'),
    error: (title: string, description?: string) => addToast(title, description, 'error'),
    info: (title: string, description?: string) => addToast(title, description, 'info'),
    warning: (title: string, description?: string) => addToast(title, description, 'warning'),
  }
}
