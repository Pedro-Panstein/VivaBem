"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { forwardRef } from "react"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glow" | "neon"
  animate?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", animate = false, children, ...props }, ref) => {
    const variants = {
      default: "glass-card",
      glow: "glass-card glow-effect",
      neon: "glass-card neon-border",
    }

    const Component = animate ? motion.div : "div"
    const animationProps = animate
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
        }
      : {}

    return (
      <Component
        ref={ref}
        className={cn(variants[variant], className)}
        {...animationProps}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
