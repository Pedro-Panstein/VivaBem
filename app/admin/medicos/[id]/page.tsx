"use client"

import { use, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  Activity,
  Save,
  X,
} from "lucide-react"
import Link from "next/link"
import { useDataStore } from "@/hooks/use-data-store"
import type { Doctor, Patient } from "@/types"

const especialidades = [
  "Cardiologia",
  "Ortopedia",
  "Pneumologia",
  "Neurologia",
  "Dermatologia",
  "Pediatria",
  "Ginecologia",
  "Oftalmologia",
  "Psiquiatria",
  "Endocrinologia",
]

export default function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { doctors, patients, medicalRecords, updateDoctor, initializeData } = useDataStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    crm: "",
    especialidade: "",
    telefone: "",
  })

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const doctor = doctors.find((d) => d.id === id)
  const doctorPatients = patients.filter((p) => doctor?.pacientes.includes(p.id))
  const doctorRecords = medicalRecords.filter((r) => r.medicoId === id)

  useEffect(() => {
    if (doctor) {
      setFormData({
        nome: doctor.nome,
        email: doctor.email,
        crm: doctor.crm,
        especialidade: doctor.especialidade,
        telefone: doctor.telefone || "",
      })
    }
  }, [doctor])

  const handleSave = () => {
    if (!doctor) return
    updateDoctor(doctor.id, {
      nome: formData.nome,
      email: formData.email,
      crm: formData.crm,
      especialidade: formData.especialidade,
      telefone: formData.telefone,
    })
    setIsEditing(false)
  }

  if (!doctor) {
    return (
      <DashboardLayout title="Medico nao encontrado" allowedRoles={["ADMIN"]}>
        <GlassCard className="p-8 text-center">
          <Stethoscope className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-bold text-foreground">Medico nao encontrado</h2>
          <p className="mt-2 text-muted-foreground">O medico solicitado nao existe ou foi removido.</p>
          <Link href="/admin/medicos">
            <Button className="mt-4">Voltar para lista</Button>
          </Link>
        </GlassCard>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={`Dr(a). ${doctor.nome}`}
      subtitle={doctor.especialidade}
      allowedRoles={["ADMIN"]}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/admin/medicos">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para lista
          </Button>
        </Link>

        {/* Doctor Info Card */}
        <GlassCard className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-20 w-20 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 blur-lg opacity-40" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-600/20 border-2 border-blue-500/30">
                  <span className="text-2xl font-bold text-blue-400">
                    {doctor.nome.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">{doctor.nome}</h2>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      doctor.ativo
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {doctor.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p className="text-cyan-400">{doctor.especialidade}</p>
                <p className="text-sm text-muted-foreground">{doctor.crm}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar Medico
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-4 border border-cyan-500/10">
              <Mail className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground break-all">{doctor.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-4 border border-cyan-500/10">
              <Phone className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs text-muted-foreground">Telefone</p>
                <p className="text-sm font-medium text-foreground">{doctor.telefone || "Nao informado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-4 border border-cyan-500/10">
              <Users className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs text-muted-foreground">Pacientes</p>
                <p className="text-sm font-medium text-foreground">{doctorPatients.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-background/50 p-4 border border-cyan-500/10">
              <FileText className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs text-muted-foreground">Registros</p>
                <p className="text-sm font-medium text-foreground">{doctorRecords.length}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Tabs */}
        <Tabs defaultValue="pacientes" className="space-y-4">
          <TabsList className="glass-card border border-cyan-500/20 p-1">
            <TabsTrigger value="pacientes" className="data-[state=active]:bg-cyan-500/20">
              <Users className="mr-2 h-4 w-4" />
              Pacientes ({doctorPatients.length})
            </TabsTrigger>
            <TabsTrigger value="registros" className="data-[state=active]:bg-cyan-500/20">
              <FileText className="mr-2 h-4 w-4" />
              Registros ({doctorRecords.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pacientes">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Pacientes Atendidos</h3>
              {doctorPatients.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {doctorPatients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-background/50 border border-cyan-500/10 p-4 hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                          <span className="text-sm font-bold text-green-400">
                            {patient.nome.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.nome}</p>
                          <p className="text-xs text-muted-foreground">{patient.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{patient.tipoSanguineo || "N/A"}</span>
                        <span>{patient.genero === "M" ? "Masculino" : patient.genero === "F" ? "Feminino" : "Outro"}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">Nenhum paciente atribuido</p>
                </div>
              )}
            </GlassCard>
          </TabsContent>

          <TabsContent value="registros">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Registros Medicos</h3>
              {doctorRecords.length > 0 ? (
                <div className="space-y-4">
                  {doctorRecords.map((record) => {
                    const patient = patients.find((p) => p.id === record.pacienteId)
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-background/50 border border-cyan-500/10 p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium text-foreground">{record.titulo}</p>
                            <p className="text-sm text-muted-foreground">
                              Paciente: {patient?.nome || "Desconhecido"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                record.tipo === "CONSULTA"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : record.tipo === "EXAME"
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "bg-cyan-500/20 text-cyan-400"
                              }`}
                            >
                              {record.tipo}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(record.data).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {record.descricao}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">Nenhum registro encontrado</p>
                </div>
              )}
            </GlassCard>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="glass-card border-cyan-500/20 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Editar Medico</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome Completo</Label>
                <Input
                  id="edit-nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-crm">CRM</Label>
                  <Input
                    id="edit-crm"
                    value={formData.crm}
                    onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-telefone">Telefone</Label>
                  <Input
                    id="edit-telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-especialidade">Especialidade</Label>
                <Select
                  value={formData.especialidade}
                  onValueChange={(value) => setFormData({ ...formData, especialidade: value })}
                >
                  <SelectTrigger className="bg-background/50 border-cyan-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidades.map((esp) => (
                      <SelectItem key={esp} value={esp}>
                        {esp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
