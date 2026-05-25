import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
}

export function Button({
  className = '',
  variant = 'default',
  size = 'default',
  children,
  ...props
}: ButtonProps) {
  const baseClass = 'btn'
  
  const variantClasses: Record<string, string> = {
    default: 'btn-default',
    destructive: 'btn-destructive',
    outline: 'btn-outline',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    link: 'btn-link',
    gradient: 'btn-gradient',
  }
  
  const sizeClasses: Record<string, string> = {
    default: 'btn-default-size',
    sm: 'btn-sm',
    lg: 'btn-lg',
    icon: 'btn-icon',
  }
  
  const classes = [
    baseClass,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ')
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
