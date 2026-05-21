"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  FileText,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import { useAuth } from "@/hooks/use-auth"
import type { MedicalRecord } from "@/types"

export default function MedicoRegistrosPage() {
  const { user } = useAuth()
  const { medicalRecords, patients, addMedicalRecord, deleteMedicalRecord } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newRecord, setNewRecord] = useState({
    pacienteId: "",
    tipo: "CONSULTATION",
    diagnostico: "",
    descricao: "",
    prescricao: "",
  })

  const filteredRecords = medicalRecords.filter((r) => {
    const patient = patients.find((p) => p.id === r.pacienteId)
    const matchesSearch =
      patient?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.diagnostico.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === "all" || r.tipo === filterSeverity
    return matchesSearch && matchesSeverity
  })

  const handleAddRecord = () => {
    if (!newRecord.pacienteId || !newRecord.diagnostico) return

    const record: Omit<MedicalRecord, "id"> = {
      pacienteId: newRecord.pacienteId,
      medicoId: user?.id || "",
      tipo: newRecord.tipo as MedicalRecord["tipo"],
      diagnostico: newRecord.diagnostico,
      descricao: newRecord.descricao,
      prescricao: newRecord.prescricao || undefined,
      data: new Date().toISOString(),
    }

    addMedicalRecord(record)
    setIsAddDialogOpen(false)
    setNewRecord({
      pacienteId: "",
      tipo: "CONSULTATION",
      diagnostico: "",
      descricao: "",
      prescricao: "",
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EXAM":
        return { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400" }
      case "SURGERY":
        return { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400" }
      case "FOLLOW_UP":
        return { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400" }
      default:
        return { bg: "bg-cyan-500/20", border: "border-cyan-500/30", text: "text-cyan-400" }
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "EXAM": return "Exame"
      case "SURGERY": return "Cirurgia"
      case "FOLLOW_UP": return "Retorno"
      default: return "Consulta"
    }
  }

  return (
    <DashboardLayout
      title="Registros Medicos"
      subtitle="Gerencie os registros medicos dos seus pacientes"
      allowedRoles={["DOCTOR"]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar registros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-cyan-500/20"
                />
              </div>
              <div className="flex gap-3">
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-cyan-500/20">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="CONSULTATION">Consultas</SelectItem>
                    <SelectItem value="EXAM">Exames</SelectItem>
                    <SelectItem value="SURGERY">Cirurgias</SelectItem>
                    <SelectItem value="FOLLOW_UP">Retornos</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Registro
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total", value: medicalRecords.length, icon: FileText, color: "cyan" },
            { label: "Consultas", value: medicalRecords.filter(r => r.tipo === "CONSULTATION").length, icon: User, color: "blue" },
            { label: "Exames", value: medicalRecords.filter(r => r.tipo === "EXAM").length, icon: Activity, color: "green" },
            { label: "Cirurgias", value: medicalRecords.filter(r => r.tipo === "SURGERY").length, icon: AlertTriangle, color: "red" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${stat.color}-500/20`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.map((record, index) => {
            const patient = patients.find((p) => p.id === record.pacienteId)
            const colors = getTypeColor(record.tipo)

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-6 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} border ${colors.border}`}>
                        <FileText className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{record.diagnostico}</h3>
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                            {getTypeLabel(record.tipo)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Paciente: {patient?.nome || "Desconhecido"}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {record.descricao}
                        </p>
                        {record.prescricao && (
                          <p className="text-xs text-cyan-400 mt-2">
                            Prescricao: {record.prescricao}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.data).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-red-500/20 hover:bg-red-500/10"
                        onClick={() => deleteMedicalRecord(record.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {filteredRecords.length === 0 && (
          <GlassCard className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Nenhum registro encontrado
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Crie um novo registro medico
            </p>
          </GlassCard>
        )}

        {/* Add Record Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Novo Registro Medico
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Adicione um novo registro para um paciente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Paciente</Label>
                <Select
                  value={newRecord.pacienteId}
                  onValueChange={(v) => setNewRecord({ ...newRecord, pacienteId: v })}
                >
                  <SelectTrigger className="bg-background/50 border-cyan-500/20">
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={newRecord.tipo}
                  onValueChange={(v) => setNewRecord({ ...newRecord, tipo: v })}
                >
                  <SelectTrigger className="bg-background/50 border-cyan-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONSULTATION">Consulta</SelectItem>
                    <SelectItem value="EXAM">Exame</SelectItem>
                    <SelectItem value="SURGERY">Cirurgia</SelectItem>
                    <SelectItem value="FOLLOW_UP">Retorno</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Diagnostico</Label>
                <Input
                  value={newRecord.diagnostico}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, diagnostico: e.target.value })
                  }
                  placeholder="Ex: Hipertensao arterial"
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Descricao</Label>
                <Textarea
                  value={newRecord.descricao}
                  onChange={(e) => setNewRecord({ ...newRecord, descricao: e.target.value })}
                  placeholder="Descreva os detalhes..."
                  className="bg-background/50 border-cyan-500/20 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Prescricao (opcional)</Label>
                <Input
                  value={newRecord.prescricao}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, prescricao: e.target.value })
                  }
                  placeholder="Ex: Losartana 50mg 1x ao dia"
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddRecord}
                className="bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                Criar Registro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
