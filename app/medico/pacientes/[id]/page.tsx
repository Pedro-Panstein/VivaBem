"use client"

import { use, useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle,
  FileText,
  User,
  Pill,
  Clock,
  Calendar,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import { useAuth } from "@/hooks/use-auth"
import type { BodyRegion, Medication } from "@/types"
import Link from "next/link"
import { HumanBody } from "@/components/human-body"

const bodyRegionOptions = [
  "head", "brain", "eyes", "neck", "chest", "heart", "lungs", 
  "stomach", "liver", "kidneys", "left-arm", "right-arm", 
  "left-hand", "right-hand", "left-leg", "right-leg", 
  "left-foot", "right-foot", "spine",
] as const

const regionLabels: Record<string, string> = {
  head: "Cabeca", brain: "Cerebro", eyes: "Olhos", neck: "Pescoco",
  chest: "Torax", heart: "Coracao", lungs: "Pulmoes", stomach: "Estomago",
  liver: "Figado", kidneys: "Rins", "left-arm": "Braco Esquerdo",
  "right-arm": "Braco Direito", "left-hand": "Mao Esquerda",
  "right-hand": "Mao Direita", "left-leg": "Perna Esquerda",
  "right-leg": "Perna Direita", "left-foot": "Pe Esquerdo",
  "right-foot": "Pe Direito", spine: "Coluna",
}

const frequenciaOptions = [
  { value: "1x-dia", label: "1 vez ao dia" },
  { value: "2x-dia", label: "2 vezes ao dia" },
  { value: "3x-dia", label: "3 vezes ao dia" },
  { value: "4x-dia", label: "4 vezes ao dia" },
  { value: "6h-6h", label: "De 6 em 6 horas" },
  { value: "8h-8h", label: "De 8 em 8 horas" },
  { value: "12h-12h", label: "De 12 em 12 horas" },
  { value: "semanal", label: "1 vez por semana" },
  { value: "quando-necessario", label: "Quando necessario" },
]

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { patients, medicalRecords, updatePatient } = useDataStore()
  const { user } = useAuth()
  
  const patient = patients.find((p) => p.id === id)
  const records = medicalRecords.filter((r) => r.pacienteId === id)

  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] = useState(false)
  const [isEditMedicationDialogOpen, setIsEditMedicationDialogOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
  
  const [newRegion, setNewRegion] = useState({
    regiao: "head",
    severidade: "NORMAL",
    condicao: "",
    observacoes: "",
  })

  const [newMedication, setNewMedication] = useState({
    nome: "",
    dosagem: "",
    frequencia: "1x-dia",
    horarios: "",
    instrucoes: "",
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: "",
  })

  if (!patient) {
    return (
      <DashboardLayout title="Paciente nao encontrado" allowedRoles={["DOCTOR"]}>
        <GlassCard className="p-12 text-center">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            Paciente nao encontrado
          </h3>
          <Link href="/medico/pacientes">
            <Button className="mt-4">Voltar</Button>
          </Link>
        </GlassCard>
      </DashboardLayout>
    )
  }

  const bodyRegions = patient.regioesCorporais || []
  const medications = patient.medicamentos || []

  const handleAddRegion = () => {
    if (!newRegion.condicao) return
    const region: BodyRegion = {
      id: `region-${Date.now()}`,
      regiao: newRegion.regiao as BodyRegion["regiao"],
      severidade: newRegion.severidade as BodyRegion["severidade"],
      condicao: newRegion.condicao,
      observacoes: newRegion.observacoes,
      ultimaAtualizacao: new Date().toISOString(),
    }
    updatePatient(patient.id, { regioesCorporais: [...bodyRegions, region] })
    setIsAddDialogOpen(false)
    setNewRegion({ regiao: "head", severidade: "NORMAL", condicao: "", observacoes: "" })
  }

  const handleEditRegion = () => {
    if (!selectedRegion) return
    const updatedRegions = bodyRegions.map((r) =>
      r.id === selectedRegion.id
        ? {
            ...r,
            severidade: newRegion.severidade as BodyRegion["severidade"],
            condicao: newRegion.condicao || r.condicao,
            observacoes: newRegion.observacoes || r.observacoes,
            ultimaAtualizacao: new Date().toISOString(),
          }
        : r
    )
    updatePatient(patient.id, { regioesCorporais: updatedRegions })
    setIsEditDialogOpen(false)
    setSelectedRegion(null)
  }

  const handleDeleteRegion = (regionId: string) => {
    const updatedRegions = bodyRegions.filter((r) => r.id !== regionId)
    updatePatient(patient.id, { regioesCorporais: updatedRegions })
  }

  const handleRegionClick = (region: BodyRegion) => {
    setSelectedRegion(region)
    setNewRegion({
      regiao: region.regiao,
      severidade: region.severidade,
      condicao: region.condicao,
      observacoes: region.observacoes || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleAddMedication = () => {
    if (!newMedication.nome || !newMedication.dosagem) return
    const medication: Medication = {
      id: `med-${Date.now()}`,
      nome: newMedication.nome,
      dosagem: newMedication.dosagem,
      frequencia: newMedication.frequencia,
      horarios: newMedication.horarios.split(',').map(h => h.trim()).filter(Boolean),
      instrucoes: newMedication.instrucoes,
      dataInicio: newMedication.dataInicio,
      dataFim: newMedication.dataFim || undefined,
      prescritoPor: user?.nome || "Medico",
      ativo: true,
    }
    updatePatient(patient.id, { medicamentos: [...medications, medication] })
    setIsAddMedicationDialogOpen(false)
    setNewMedication({
      nome: "",
      dosagem: "",
      frequencia: "1x-dia",
      horarios: "",
      instrucoes: "",
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: "",
    })
  }

  const handleEditMedication = () => {
    if (!selectedMedication) return
    const updatedMedications = medications.map((m) =>
      m.id === selectedMedication.id
        ? {
            ...m,
            nome: newMedication.nome || m.nome,
            dosagem: newMedication.dosagem || m.dosagem,
            frequencia: newMedication.frequencia,
            horarios: newMedication.horarios.split(',').map(h => h.trim()).filter(Boolean),
            instrucoes: newMedication.instrucoes,
            dataFim: newMedication.dataFim || undefined,
          }
        : m
    )
    updatePatient(patient.id, { medicamentos: updatedMedications })
    setIsEditMedicationDialogOpen(false)
    setSelectedMedication(null)
  }

  const handleDeleteMedication = (medicationId: string) => {
    const updatedMedications = medications.filter((m) => m.id !== medicationId)
    updatePatient(patient.id, { medicamentos: updatedMedications })
  }

  const handleToggleMedicationStatus = (medicationId: string) => {
    const updatedMedications = medications.map((m) =>
      m.id === medicationId ? { ...m, ativo: !m.ativo } : m
    )
    updatePatient(patient.id, { medicamentos: updatedMedications })
  }

  const openEditMedicationDialog = (medication: Medication) => {
    setSelectedMedication(medication)
    setNewMedication({
      nome: medication.nome,
      dosagem: medication.dosagem,
      frequencia: medication.frequencia,
      horarios: medication.horarios.join(', '),
      instrucoes: medication.instrucoes,
      dataInicio: medication.dataInicio,
      dataFim: medication.dataFim || "",
    })
    setIsEditMedicationDialogOpen(true)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400" }
      case "WARNING":
        return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400" }
      default:
        return { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400" }
    }
  }

  return (
    <DashboardLayout
      title={patient.nome}
      subtitle="Detalhes e monitoramento do paciente"
      allowedRoles={["DOCTOR"]}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/medico/pacientes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista
        </Link>

        <Tabs defaultValue="visao-geral" className="space-y-6">
          <TabsList className="bg-background/50 border border-cyan-500/20">
            <TabsTrigger value="visao-geral">Visao Geral</TabsTrigger>
            <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
            <TabsTrigger value="historico">Historico</TabsTrigger>
          </TabsList>

          {/* Visao Geral Tab */}
          <TabsContent value="visao-geral" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Patient Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative h-16 w-16">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-md opacity-30" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-500/30">
                        <span className="text-2xl font-bold text-cyan-400">
                          {patient.nome.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{patient.nome}</h2>
                      <p className="text-sm text-muted-foreground">{patient.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-cyan-500/10 pb-2">
                      <span className="text-muted-foreground">Tipo Sanguineo</span>
                      <span className="text-foreground">{patient.tipoSanguineo || "Nao informado"}</span>
                    </div>
                    <div className="flex justify-between border-b border-cyan-500/10 pb-2">
                      <span className="text-muted-foreground">Alergias</span>
                      <span className="text-foreground">
                        {patient.alergias && patient.alergias.length > 0
                          ? patient.alergias.join(", ")
                          : "Nenhuma"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-cyan-500/10 pb-2">
                      <span className="text-muted-foreground">Condicoes</span>
                      <span className="text-foreground">{bodyRegions.length} ativa(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medicamentos</span>
                      <span className="text-foreground">{medications.filter(m => m.ativo).length} ativo(s)</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Condicao
                  </Button>
                </GlassCard>
              </motion.div>

              {/* Human Body Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <GlassCard className="p-6 h-full">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Visualizacao do Corpo
                  </h3>
                  <HumanBody
                    regions={bodyRegions}
                    onRegionClick={handleRegionClick}
                    interactive
                  />
                </GlassCard>
              </motion.div>
            </div>

            {/* Body Regions List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Regioes Monitoradas ({bodyRegions.length})
                </h3>
                {bodyRegions.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {bodyRegions.map((region) => {
                      const colors = getSeverityColor(region.severidade)
                      const Icon =
                        region.severidade === "CRITICAL"
                          ? AlertTriangle
                          : region.severidade === "WARNING"
                          ? Activity
                          : CheckCircle

                      return (
                        <div
                          key={region.id}
                          className={`rounded-lg p-4 ${colors.bg} border ${colors.border}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className={`h-5 w-5 ${colors.text}`} />
                              <span className="font-medium text-foreground">
                                {regionLabels[region.regiao] || region.regiao}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRegionClick(region)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-400"
                                onClick={() => handleDeleteRegion(region.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-foreground">{region.condicao}</p>
                          {region.observacoes && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              {region.observacoes}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-muted-foreground">
                            Atualizado:{" "}
                            {new Date(region.ultimaAtualizacao).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                      Nenhuma regiao monitorada ainda
                    </p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </TabsContent>

          {/* Medicamentos Tab */}
          <TabsContent value="medicamentos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">
                Medicamentos ({medications.length})
              </h3>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600"
                onClick={() => setIsAddMedicationDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Medicamento
              </Button>
            </div>

            {medications.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {medications.map((medication) => (
                  <motion.div
                    key={medication.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <GlassCard className={`p-6 ${!medication.ativo ? 'opacity-60' : ''}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${medication.ativo ? 'bg-cyan-500/20' : 'bg-gray-500/20'}`}>
                            <Pill className={`h-6 w-6 ${medication.ativo ? 'text-cyan-400' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{medication.nome}</h4>
                            <p className="text-sm text-muted-foreground">{medication.dosagem}</p>
                          </div>
                        </div>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${medication.ativo ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {medication.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {frequenciaOptions.find(f => f.value === medication.frequencia)?.label || medication.frequencia}
                          </span>
                        </div>
                        {medication.horarios.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {medication.horarios.map((horario, idx) => (
                              <span key={idx} className="inline-flex rounded-full px-2 py-1 text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                {horario}
                              </span>
                            ))}
                          </div>
                        )}
                        {medication.instrucoes && (
                          <p className="text-sm text-muted-foreground">
                            {medication.instrucoes}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Inicio: {new Date(medication.dataInicio).toLocaleDateString("pt-BR")}</span>
                          {medication.dataFim && (
                            <span>- Fim: {new Date(medication.dataFim).toLocaleDateString("pt-BR")}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Prescrito por: {medication.prescritoPor}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-cyan-500/20"
                          onClick={() => handleToggleMedicationStatus(medication.id)}
                        >
                          {medication.ativo ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => openEditMedicationDialog(medication)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-400"
                          onClick={() => handleDeleteMedication(medication.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            ) : (
              <GlassCard className="p-12 text-center">
                <Pill className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Nenhum medicamento prescrito ainda
                </p>
                <Button
                  className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600"
                  onClick={() => setIsAddMedicationDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Medicamento
                </Button>
              </GlassCard>
            )}
          </TabsContent>

          {/* Historico Tab */}
          <TabsContent value="historico" className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Historico de Registros
              </h3>
              {records.length > 0 ? (
                <div className="space-y-4">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-start gap-4 rounded-lg bg-background/50 border border-cyan-500/10 p-4"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                        <FileText className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-foreground">{record.diagnostico}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(record.data).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{record.descricao}</p>
                        {record.prescricao && (
                          <p className="mt-2 text-xs text-cyan-400">
                            Prescricao: {record.prescricao}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    Nenhum registro medico encontrado
                  </p>
                </div>
              )}
            </GlassCard>
          </TabsContent>
        </Tabs>

        {/* Add Region Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20">
            <DialogHeader>
              <DialogTitle>Adicionar Condicao</DialogTitle>
              <DialogDescription>
                Marque uma regiao do corpo com uma condicao
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Regiao do Corpo</Label>
                <Select
                  value={newRegion.regiao}
                  onValueChange={(v) => setNewRegion({ ...newRegion, regiao: v })}
                >
                  <SelectTrigger className="bg-background/50 border-cyan-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyRegionOptions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {regionLabels[region]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severidade</Label>
                <Select
                  value={newRegion.severidade}
                  onValueChange={(v) => setNewRegion({ ...newRegion, severidade: v })}
                >
                  <SelectTrigger className="bg-background/50 border-cyan-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="WARNING">Atencao</SelectItem>
                    <SelectItem value="CRITICAL">Critico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condicao/Diagnostico</Label>
                <Input
                  value={newRegion.condicao}
                  onChange={(e) => setNewRegion({ ...newRegion, condicao: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Observacoes</Label>
                <Textarea
                  value={newRegion.observacoes}
                  onChange={(e) => setNewRegion({ ...newRegion, observacoes: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddRegion} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Region Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20">
            <DialogHeader>
              <DialogTitle>Editar Condicao</DialogTitle>
              <DialogDescription>
                Atualize as informacoes da regiao {selectedRegion && (regionLabels[selectedRegion.regiao] || selectedRegion.regiao)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Severidade</Label>
                <Select
                  value={newRegion.severidade}
                  onValueChange={(v) => setNewRegion({ ...newRegion, severidade: v })}
                >
                  <SelectTrigger className="bg-background/50 border-cyan-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="WARNING">Atencao</SelectItem>
                    <SelectItem value="CRITICAL">Critico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condicao/Diagnostico</Label>
                <Input
                  value={newRegion.condicao}
                  onChange={(e) => setNewRegion({ ...newRegion, condicao: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Observacoes</Label>
                <Textarea
                  value={newRegion.observacoes}
                  onChange={(e) => setNewRegion({ ...newRegion, observacoes: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditRegion} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Medication Dialog */}
        <Dialog open={isAddMedicationDialogOpen} onOpenChange={setIsAddMedicationDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20 max-w-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Medicamento</DialogTitle>
              <DialogDescription>
                Prescreva um novo medicamento para o paciente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Medicamento</Label>
                  <Input
                    value={newMedication.nome}
                    onChange={(e) => setNewMedication({ ...newMedication, nome: e.target.value })}
                    placeholder="Ex: Dipirona"
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dosagem</Label>
                  <Input
                    value={newMedication.dosagem}
                    onChange={(e) => setNewMedication({ ...newMedication, dosagem: e.target.value })}
                    placeholder="Ex: 500mg"
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Frequencia</Label>
                <Select
                  value={newMedication.frequencia}
                  onValueChange={(v) => setNewMedication({ ...newMedication, frequencia: v })}
                >
                  <SelectTrigger className="bg-background/50 border-cyan-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequenciaOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Horarios (separados por virgula)</Label>
                <Input
                  value={newMedication.horarios}
                  onChange={(e) => setNewMedication({ ...newMedication, horarios: e.target.value })}
                  placeholder="Ex: 08:00, 14:00, 20:00"
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Inicio</Label>
                  <Input
                    type="date"
                    value={newMedication.dataInicio}
                    onChange={(e) => setNewMedication({ ...newMedication, dataInicio: e.target.value })}
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Fim (opcional)</Label>
                  <Input
                    type="date"
                    value={newMedication.dataFim}
                    onChange={(e) => setNewMedication({ ...newMedication, dataFim: e.target.value })}
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Instrucoes de Uso</Label>
                <Textarea
                  value={newMedication.instrucoes}
                  onChange={(e) => setNewMedication({ ...newMedication, instrucoes: e.target.value })}
                  placeholder="Ex: Tomar apos as refeicoes com agua"
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddMedicationDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddMedication} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Medication Dialog */}
        <Dialog open={isEditMedicationDialogOpen} onOpenChange={setIsEditMedicationDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20 max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Medicamento</DialogTitle>
              <DialogDescription>
                Atualize as informacoes do medicamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Medicamento</Label>
                  <Input
                    value={newMedication.nome}
                    onChange={(e) => setNewMedication({ ...newMedication, nome: e.target.value })}
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dosagem</Label>
                  <Input
                    value={newMedication.dosagem}
                    onChange={(e) => setNewMedication({ ...newMedication, dosagem: e.target.value })}
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Frequencia</Label>
                <Select
                  value={newMedication.frequencia}
                  onValueChange={(v) => setNewMedication({ ...newMedication, frequencia: v })}
                >
                  <SelectTrigger className="bg-background/50 border-cyan-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequenciaOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Horarios (separados por virgula)</Label>
                <Input
                  value={newMedication.horarios}
                  onChange={(e) => setNewMedication({ ...newMedication, horarios: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Data de Fim (opcional)</Label>
                <Input
                  type="date"
                  value={newMedication.dataFim}
                  onChange={(e) => setNewMedication({ ...newMedication, dataFim: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Instrucoes de Uso</Label>
                <Textarea
                  value={newMedication.instrucoes}
                  onChange={(e) => setNewMedication({ ...newMedication, instrucoes: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditMedicationDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditMedication} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
