"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"
import {
  Search,
  Activity,
  AlertTriangle,
  CheckCircle,
  Heart,
  TrendingUp,
  TrendingDown,
  Eye,
  Bell,
  RefreshCw,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import Link from "next/link"

const regionLabels: Record<string, string> = {
  head: "Cabeca", brain: "Cerebro", eyes: "Olhos", neck: "Pescoco",
  chest: "Torax", heart: "Coracao", lungs: "Pulmoes", stomach: "Estomago",
  liver: "Figado", kidneys: "Rins", "left-arm": "Braco Esquerdo",
  "right-arm": "Braco Direito", "left-hand": "Mao Esquerda",
  "right-hand": "Mao Direita", "left-leg": "Perna Esquerda",
  "right-leg": "Perna Direita", "left-foot": "Pe Esquerdo",
  "right-foot": "Pe Direito", spine: "Coluna",
}

export default function MedicoMonitoramentoPage() {
  const { patients } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")

  // Calculate all conditions across all patients
  const allConditions = patients.flatMap((patient) =>
    (patient.regioesCorporais || []).map((region) => ({
      ...region,
      patientId: patient.id,
      patientName: patient.nome,
    }))
  )

  const filteredConditions = allConditions.filter((c) => {
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.condicao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === "all" || c.severidade === filterSeverity
    return matchesSearch && matchesSeverity
  })

  const criticalCount = allConditions.filter((c) => c.severidade === "CRITICAL").length
  const warningCount = allConditions.filter((c) => c.severidade === "WARNING").length
  const normalCount = allConditions.filter((c) => c.severidade === "NORMAL").length

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400", icon: AlertTriangle }
      case "WARNING":
        return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400", icon: Activity }
      default:
        return { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", icon: CheckCircle }
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "Critico"
      case "WARNING": return "Atencao"
      default: return "Normal"
    }
  }

  return (
    <DashboardLayout
      title="Monitoramento"
      subtitle="Acompanhe as condicoes de saude dos seus pacientes em tempo real"
      allowedRoles={["DOCTOR"]}
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total Pacientes", value: patients.length, icon: Heart, color: "cyan", trend: "+5%" },
            { label: "Condicoes Criticas", value: criticalCount, icon: AlertTriangle, color: "red", trend: criticalCount > 0 ? "Atencao!" : "OK" },
            { label: "Em Observacao", value: warningCount, icon: Activity, color: "yellow", trend: "-2%" },
            { label: "Saudaveis", value: normalCount, icon: CheckCircle, color: "green", trend: "+12%" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${stat.color}-500/20`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                  </div>
                  <span className={`text-xs ${stat.trend.includes("+") ? "text-green-400" : stat.trend === "Atencao!" ? "text-red-400" : "text-muted-foreground"}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente ou condicao..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-cyan-500/20"
                />
              </div>
              <div className="flex gap-3">
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-cyan-500/20">
                    <SelectValue placeholder="Filtrar por severidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="CRITICAL">Criticas</SelectItem>
                    <SelectItem value="WARNING">Atencao</SelectItem>
                    <SelectItem value="NORMAL">Normais</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="border-cyan-500/20 hover:bg-cyan-500/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Critical Alerts */}
        {criticalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 animate-pulse">
                  <Bell className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-400">Alertas Criticos</h3>
                  <p className="text-sm text-muted-foreground">
                    {criticalCount} condicao(oes) requer(em) atencao imediata
                  </p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {allConditions
                  .filter((c) => c.severidade === "CRITICAL")
                  .map((condition, index) => (
                    <Link key={condition.id} href={`/medico/pacientes/${condition.patientId}`}>
                      <div className="flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 p-3 hover:bg-red-500/20 transition-colors cursor-pointer">
                        <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{condition.patientName}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {regionLabels[condition.regiao] || condition.regiao}: {condition.condicao}
                          </p>
                        </div>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* All Conditions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Todas as Condicoes ({filteredConditions.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredConditions.map((condition, index) => {
              const colors = getSeverityColor(condition.severidade)
              const Icon = colors.icon

              return (
                <motion.div
                  key={condition.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Link href={`/medico/pacientes/${condition.patientId}`}>
                    <GlassCard className={`p-4 hover:border-cyan-500/40 transition-all cursor-pointer ${
                      condition.severidade === "CRITICAL" ? "border-red-500/30" : ""
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg} border ${colors.border}`}>
                          <Icon className={`h-5 w-5 ${colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-foreground truncate">{condition.patientName}</p>
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                              {getSeverityLabel(condition.severidade)}
                            </span>
                          </div>
                          <p className="text-sm text-cyan-400">
                            {regionLabels[condition.regiao] || condition.regiao}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {condition.condicao}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Atualizado: {new Date(condition.ultimaAtualizacao).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {filteredConditions.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Nenhuma condicao encontrada
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ajuste os filtros ou adicione condicoes aos pacientes
            </p>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  )
}
