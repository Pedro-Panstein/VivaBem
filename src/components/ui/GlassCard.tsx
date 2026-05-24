import React from 'react'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassCard({ className = '', children, ...props }: GlassCardProps) {
  return (
    <div className={`glass-card ${className}`} {...props}>
      <div className="glass-card-glow" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
