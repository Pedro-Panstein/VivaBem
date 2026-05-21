"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Wrench } from "lucide-react"
import { useSystemSettings } from "@/hooks/use-system-settings"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

export function MaintenanceScreen() {
  const { settings } = useSystemSettings()
  const { logout } = useAuth()

  const handleLoginClick = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-lg w-full"
      >
        <div className="glass-card border border-cyan-500/20 rounded-2xl p-8 text-center space-y-6">
          {/* Icon */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative mx-auto w-24 h-24"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 blur-xl" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/10 border border-cyan-500/30">
              <Wrench className="h-12 w-12 text-cyan-400" />
            </div>
          </motion.div>

          {/* Warning Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Em Manutencao</span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{settings.siteName}</h1>
            <p className="text-xl text-muted-foreground">Sistema em Manutencao</p>
          </div>

          {/* Message */}
          <p className="text-muted-foreground leading-relaxed">
            {settings.maintenanceMessage}
          </p>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-cyan-400"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Footer info */}
          <div className="pt-4 border-t border-cyan-500/10">
            <p className="text-xs text-muted-foreground mb-3">
              Se voce e um administrador, faca login para acessar o sistema.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoginClick}
              className="border-cyan-500/30 hover:bg-cyan-500/10"
            >
              Fazer Login como Admin
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
