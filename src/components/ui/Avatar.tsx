import React from 'react'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children?: React.ReactNode
}

export function Avatar({ className = '', size = 'md', children, ...props }: AvatarProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl',
  }
  
  return (
    <div className={`avatar ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </div>
  )
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function AvatarImage({ className = '', ...props }: AvatarImageProps) {
  return <img className={`avatar-image ${className}`} {...props} />
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function AvatarFallback({ className = '', children, ...props }: AvatarFallbackProps) {
  return (
    <div className={`avatar-fallback ${className}`} {...props}>
      {children}
    </div>
  )
}
