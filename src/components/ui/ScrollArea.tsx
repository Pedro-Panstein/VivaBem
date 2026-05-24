import React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ScrollArea({ children, className = '', style, ...props }: ScrollAreaProps) {
  return (
    <div 
      className={`scroll-area ${className}`} 
      style={{ overflow: 'auto', ...style }}
      {...props}
    >
      {children}
    </div>
  )
}
