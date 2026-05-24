import React from 'react'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Separator({ orientation = 'horizontal', className = '' }: SeparatorProps) {
  const orientationClass = orientation === 'horizontal' ? 'separator-horizontal' : 'separator-vertical'
  
  return <div className={`separator ${orientationClass} ${className}`} role="separator" />
}
