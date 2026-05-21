"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"
import { FileText, Calendar, Search, Filter, Activity, AlertTriangle, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDataStore } from "@/hooks/use-data-store"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect } from "react"

const severityColors: Record<string, { bg: string; border: string; text: string }> = {
  BAIXA: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400" },
  MEDIA: { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400" },
  ALTA: { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400" },
}

const statusLabels: Record<string, string> = {
  ATIVO: "Ativo",
  EM_TRATAMENTO: "Em Tratamento",
  MONITORANDO: "Monitorando",
  RESOLVIDO: "Resolvido",
}

export default function HistoricoPage() {
  const { user } = useAuth()
  const { patients, medicalRecords, initializeData } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    initializeData()
    setMounted(true)
  }, [initializeData])

  if (!mounted) return null

  // Find current patient
  const currentPatient = patients.find((p) => p.email === user?.email) || patients[0]
  
  // Get records for this patient
  const patientRecords = medicalRecords.filter((r) => r.pacienteId === currentPatient?.id)

  // Filter records
  const filteredRecords = patientRecords.filter((record) => {
    const matchesSearch =
      record.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === "all" || record.severidade === filterSeverity
    return matchesSearch && matchesSeverity
  })

  // Sort by date (most recent first)
  const sortedRecords = [...filteredRecords].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  )

  return (
    <DashboardLayout
      title="Historico Medico"
      subtitle="Consulte seus registros e historico de saude"
      allowedRoles={["PATIENT"]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar registros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-cyan-500/20"
                />
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-cyan-500/20">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="BAIXA">Baixa</SelectItem>
                  <SelectItem value="MEDIA">Media</SelectItem>
                  <SelectItem value="ALTA">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                <FileText className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{patientRecords.length}</p>
                <p className="text-sm text-muted-foreground">Total de Registros</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                <Activity className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {patientRecords.filter((r) => r.status === "EM_TRATAMENTO").length}
                </p>
                <p className="text-sm text-muted-foreground">Em Tratamento</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {patientRecords.filter((r) => r.severidade === "ALTA").length}
                </p>
                <p className="text-sm text-muted-foreground">Alta Prioridade</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Records List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                <Heart className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Registros Medicos</h3>
                <p className="text-sm text-muted-foreground">
                  {sortedRecords.length} registro(s) encontrado(s)
                </p>
              </div>
            </div>

            {sortedRecords.length > 0 ? (
              <div className="space-y-4">
                {sortedRecords.map((record, index) => {
                  const colors = severityColors[record.severidade] || severityColors.BAIXA
                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`rounded-lg border p-4 ${colors.bg} ${colors.border}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{record.titulo}</h4>
                          <p className="text-xs text-muted-foreground">
                            Regiao: {record.regiaoCorpo.replace(/_/g, " ")}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(record.data).toLocaleDateString("pt-BR")}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors.text} ${colors.bg}`}
                          >
                            {record.severidade}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{record.descricao}</p>
                      
                      <div className="flex items-center justify-between">
                        <span
                          className="inline-flex rounded-full bg-background/50 px-2 py-0.5 text-xs font-medium text-cyan-400"
                        >
                          {statusLabels[record.status] || record.status}
                        </span>
                        {record.nivelDor > 0 && (
                          <span className="text-xs text-muted-foreground">
                            Nivel de dor: {record.nivelDor}/10
                          </span>
                        )}
                      </div>

                      {record.recomendacoes && (
                        <div className="mt-3 rounded bg-background/30 px-3 py-2">
                          <p className="text-xs font-medium text-cyan-400 mb-1">Recomendacoes:</p>
                          <p className="text-xs text-muted-foreground">{record.recomendacoes}</p>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Nenhum registro encontrado</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
