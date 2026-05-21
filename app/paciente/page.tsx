"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  ChevronRight,
  Stethoscope,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const healthMetrics = [
  { icon: Heart, label: "Freq. Cardiaca", value: "72 bpm", status: "normal", color: "green" },
  { icon: Activity, label: "Pressao", value: "120/80", status: "normal", color: "green" },
  { icon: Thermometer, label: "Temperatura", value: "36.5 C", status: "normal", color: "green" },
  { icon: Droplets, label: "Glicose", value: "95 mg/dL", status: "normal", color: "green" },
]

const regiaoLabels: Record<string, string> = {
  CABECA: "Cabeca",
  PESCOCO: "Pescoco",
  OMBRO_ESQUERDO: "Ombro Esquerdo",
  OMBRO_DIREITO: "Ombro Direito",
  BRACO_ESQUERDO: "Braco Esquerdo",
  BRACO_DIREITO: "Braco Direito",
  MAO_ESQUERDA: "Mao Esquerda",
  MAO_DIREITA: "Mao Direita",
  TORAX: "Torax",
  CORACAO: "Coracao",
  PULMAO_ESQUERDO: "Pulmao Esquerdo",
  PULMAO_DIREITO: "Pulmao Direito",
  ABDOMEN: "Abdomen",
  COLUNA: "Coluna",
  COSTAS_SUPERIOR: "Costas Superior",
  COSTAS_INFERIOR: "Costas Inferior",
  QUADRIL: "Quadril",
  COXA_ESQUERDA: "Coxa Esquerda",
  COXA_DIREITA: "Coxa Direita",
  JOELHO_ESQUERDO: "Joelho Esquerdo",
  JOELHO_DIREITO: "Joelho Direito",
  PERNA_ESQUERDA: "Perna Esquerda",
  PERNA_DIREITA: "Perna Direita",
  PE_ESQUERDO: "Pe Esquerdo",
  PE_DIREITO: "Pe Direito",
}

export default function PacienteDashboard() {
  const { user } = useAuth()
  const { patients, medicalRecords, doctors, initializeData } = useDataStore()
  const [selectedRecord, setSelectedRecord] = useState<typeof medicalRecords[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    initializeData()
  }, [initializeData])

  // Get current patient data
  const currentPatient = patients.find(p => p.id === user?.id)
  const patientRecords = medicalRecords.filter(r => r.pacienteId === user?.id)
  const myDoctor = doctors.find(d => d.id === currentPatient?.medicoResponsavel)

  const criticalCount = patientRecords.filter(r => r.severidade === "CRITICA" || r.severidade === "ALTA").length
  const warningCount = patientRecords.filter(r => r.severidade === "MEDIA").length

  const handleRecordClick = (record: typeof medicalRecords[0]) => {
    setSelectedRecord(record)
    setIsModalOpen(true)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICA":
      case "ALTA":
        return { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400" }
      case "MEDIA":
        return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400" }
      default:
        return { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400" }
    }
  }

  return (
    <DashboardLayout
      title="Minha Saude"
      subtitle="Acompanhe seu estado de saude em tempo real"
      allowedRoles={["PATIENT"]}
    >
      <div className="space-y-6">
        {/* Health Overview */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {healthMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.2)",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                    }}
                  >
                    <metric.icon className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-xl font-bold text-foreground">{metric.value}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Alerts */}
        {(criticalCount > 0 || warningCount > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className={`p-6 ${criticalCount > 0 ? "border-red-500/30" : "border-yellow-500/30"}`}>
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    criticalCount > 0 ? "bg-red-500/20" : "bg-yellow-500/20"
                  }`}
                >
                  <AlertTriangle
                    className={`h-6 w-6 ${criticalCount > 0 ? "text-red-400" : "text-yellow-400"}`}
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {criticalCount > 0
                      ? `Voce tem ${criticalCount} condicao(oes) critica(s) que requer(em) atencao`
                      : `Voce tem ${warningCount} ponto(s) de atencao no seu monitoramento`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Clique nos registros abaixo para ver detalhes
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Records List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Meus Registros Medicos
                </h3>
                <Link
                  href="/paciente/historico"
                  className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Ver historico completo
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              {patientRecords.length > 0 ? (
                <div className="space-y-3">
                  {patientRecords.map((record) => {
                    const colors = getSeverityColor(record.severidade)
                    const Icon =
                      record.severidade === "CRITICA" || record.severidade === "ALTA"
                        ? AlertTriangle
                        : record.severidade === "MEDIA"
                        ? Activity
                        : CheckCircle

                    return (
                      <button
                        key={record.id}
                        onClick={() => handleRecordClick(record)}
                        className={`w-full text-left rounded-lg p-4 ${colors.bg} border ${colors.border} hover:opacity-80 transition-opacity`}
                      >
                        <div className="flex items-center gap-4">
                          <Icon className={`h-6 w-6 ${colors.text}`} />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">
                              {record.titulo}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {regiaoLabels[record.regiaoCorpo] || record.regiaoCorpo} - {record.tipo}
                            </p>
                          </div>
                          <span className={`text-xs font-medium ${colors.text}`}>
                            {record.severidade}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
                  <p className="mt-4 text-foreground font-medium">Tudo certo!</p>
                  <p className="text-sm text-muted-foreground">
                    Nenhum registro medico ativo
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* My Doctor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Meu Medico
                </h3>
                {myDoctor ? (
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-500/30">
                      <Stethoscope className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{myDoctor.nome}</p>
                      <p className="text-sm text-cyan-400">{myDoctor.especialidade}</p>
                      <p className="text-xs text-muted-foreground">{myDoctor.crm}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Stethoscope className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Nenhum medico atribuido
                    </p>
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Patient Info */}
            {currentPatient && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Minhas Informacoes
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo Sanguineo</span>
                      <span className="font-medium text-foreground">{currentPatient.tipoSanguineo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Nascimento</span>
                      <span className="font-medium text-foreground">
                        {new Date(currentPatient.dataNascimento).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    {currentPatient.alergias && currentPatient.alergias.length > 0 && (
                      <div>
                        <span className="text-muted-foreground block mb-2">Alergias</span>
                        <div className="flex flex-wrap gap-1">
                          {currentPatient.alergias.map((alergia, i) => (
                            <span
                              key={i}
                              className="inline-flex rounded-full px-2 py-0.5 text-xs bg-red-500/20 text-red-400 border border-red-500/30"
                            >
                              {alergia}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {currentPatient.medicamentos && currentPatient.medicamentos.length > 0 && (
                      <div>
                        <span className="text-muted-foreground block mb-2">Medicamentos</span>
                        <div className="flex flex-wrap gap-1">
                          {currentPatient.medicamentos.map((med, i) => (
                            <span
                              key={i}
                              className="inline-flex rounded-full px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            >
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>

        {/* Record Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="glass-card border-cyan-500/20 max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-foreground">
                {selectedRecord && (
                  <>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        selectedRecord.severidade === "CRITICA" || selectedRecord.severidade === "ALTA"
                          ? "bg-red-500/20"
                          : selectedRecord.severidade === "MEDIA"
                          ? "bg-yellow-500/20"
                          : "bg-green-500/20"
                      }`}
                    >
                      {selectedRecord.severidade === "CRITICA" || selectedRecord.severidade === "ALTA" ? (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      ) : selectedRecord.severidade === "MEDIA" ? (
                        <Activity className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    {selectedRecord.titulo}
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Detalhes do registro medico
              </DialogDescription>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-4 pt-4">
                <div className="rounded-lg bg-background/50 border border-cyan-500/10 p-4">
                  <p className="text-sm text-muted-foreground mb-1">Descricao</p>
                  <p className="text-foreground">{selectedRecord.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-background/50 border border-cyan-500/10 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Regiao</p>
                    <p className="font-medium text-foreground">
                      {regiaoLabels[selectedRecord.regiaoCorpo] || selectedRecord.regiaoCorpo}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background/50 border border-cyan-500/10 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                    <p className="font-medium text-foreground">{selectedRecord.tipo}</p>
                  </div>
                </div>

                {selectedRecord.recomendacoes && (
                  <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-4">
                    <p className="text-sm font-medium text-cyan-400 mb-2">
                      Recomendacoes
                    </p>
                    <p className="text-sm text-foreground">{selectedRecord.recomendacoes}</p>
                  </div>
                )}

                {selectedRecord.prevencao && (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                    <p className="text-sm font-medium text-green-400 mb-2">
                      Prevencao
                    </p>
                    <p className="text-sm text-foreground">{selectedRecord.prevencao}</p>
                  </div>
                )}

                <div className="rounded-lg bg-background/50 border border-cyan-500/10 p-4">
                  <p className="text-sm text-muted-foreground mb-1">Data do Registro</p>
                  <p className="text-foreground">
                    {new Date(selectedRecord.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
