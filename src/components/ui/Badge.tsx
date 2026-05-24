import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children: React.ReactNode
}

export function Badge({ className = '', variant = 'default', children, ...props }: BadgeProps) {
  const variantClasses: Record<string, string> = {
    default: 'badge-default',
    secondary: 'badge-secondary',
    destructive: 'badge-destructive',
    outline: 'badge-outline',
  }
  
  return (
    <div className={`badge ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
