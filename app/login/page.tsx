"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useDataStore } from "@/hooks/use-data-store"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, user, isAuthenticated } = useAuth()
  const { initializeData } = useDataStore()
  const router = useRouter()

  // Initialize data store on mount
  useEffect(() => {
    initializeData()
  }, [initializeData])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const userType = user.tipo === "ADMIN" ? "admin" : user.tipo === "DOCTOR" ? "medico" : "paciente"
      router.push(`/${userType}`)
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = login(email, senha)

    if (result.success) {
      // The redirect will be handled by the useEffect above
    } else {
      setError(result.error || "Email ou senha invalidos")
    }

    setIsLoading(false)
  }

  const demoAccounts = [
    { email: "admin@vivabem.com", senha: "admin123", role: "Administrador" },
    { email: "ana.santos@vivabem.com", senha: "medico123", role: "Medico" },
    { email: "joao.oliveira@email.com", senha: "paciente123", role: "Paciente" },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>

          <GlassCard className="p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 relative h-16 w-16">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 blur-lg opacity-50" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gradient">Bem-vindo ao VivaBem</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Entre para acessar sua conta
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-cyan-500/20 focus:border-cyan-500/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-foreground">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="********"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 bg-background/50 border-cyan-500/20 focus:border-cyan-500/50"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium"
              >
                {isLoading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-8 border-t border-cyan-500/20 pt-6">
              <p className="mb-4 text-center text-xs text-muted-foreground">
                Contas de demonstração
              </p>
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => {
                      setEmail(account.email)
                      setSenha(account.senha)
                    }}
                    className="w-full rounded-lg bg-background/50 border border-cyan-500/20 p-3 text-left text-sm transition-all hover:border-cyan-500/40 hover:bg-cyan-500/5"
                  >
                    <span className="font-medium text-foreground">{account.role}</span>
                    <span className="block text-xs text-muted-foreground">{account.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
