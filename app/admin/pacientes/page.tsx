"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  Droplet,
  AlertTriangle,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import type { Patient } from "@/types"

const tiposSanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const generos = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Feminino" },
  { value: "O", label: "Outro" },
]

export default function AdminPacientesPage() {
  const { patients, doctors, addPatient, updatePatient, deletePatient, initializeData } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMedico, setFilterMedico] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    dataNascimento: "",
    genero: "M",
    telefone: "",
    endereco: "",
    medicoResponsavel: "",
    contatoEmergencia: "",
    tipoSanguineo: "O+",
    alergias: "",
  })

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMedico =
      filterMedico === "all" || patient.medicoResponsavel === filterMedico
    return matchesSearch && matchesMedico
  })

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleAddPatient = () => {
    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      tipo: "PATIENT",
      ativo: true,
      dataNascimento: formData.dataNascimento,
      genero: formData.genero as "M" | "F" | "O",
      telefone: formData.telefone,
      endereco: formData.endereco,
      medicoResponsavel: formData.medicoResponsavel,
      contatoEmergencia: formData.contatoEmergencia,
      tipoSanguineo: formData.tipoSanguineo,
      alergias: formData.alergias.split(",").map(a => a.trim()).filter(a => a),
      medicamentos: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    }
    addPatient(newPatient)
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditPatient = () => {
    if (!selectedPatient) return
    updatePatient(selectedPatient.id, {
      nome: formData.nome,
      email: formData.email,
      dataNascimento: formData.dataNascimento,
      genero: formData.genero as "M" | "F" | "O",
      telefone: formData.telefone,
      endereco: formData.endereco,
      medicoResponsavel: formData.medicoResponsavel,
      contatoEmergencia: formData.contatoEmergencia,
      tipoSanguineo: formData.tipoSanguineo,
      alergias: formData.alergias.split(",").map(a => a.trim()).filter(a => a),
    })
    setIsEditDialogOpen(false)
    setSelectedPatient(null)
  }

  const handleDeletePatient = () => {
    if (!selectedPatient) return
    deletePatient(selectedPatient.id)
    setIsDeleteDialogOpen(false)
    setSelectedPatient(null)
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      senha: "",
      dataNascimento: "",
      genero: "M",
      telefone: "",
      endereco: "",
      medicoResponsavel: "",
      contatoEmergencia: "",
      tipoSanguineo: "O+",
      alergias: "",
    })
  }

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient)
    setFormData({
      nome: patient.nome,
      email: patient.email,
      senha: "",
      dataNascimento: patient.dataNascimento,
      genero: patient.genero,
      telefone: patient.telefone || "",
      endereco: patient.endereco || "",
      medicoResponsavel: patient.medicoResponsavel || "",
      contatoEmergencia: patient.contatoEmergencia || "",
      tipoSanguineo: patient.tipoSanguineo || "O+",
      alergias: patient.alergias?.join(", ") || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsDeleteDialogOpen(true)
  }

  const getMedicoNome = (medicoId: string) => {
    const medico = doctors.find(d => d.id === medicoId)
    return medico?.nome || "Nao atribuido"
  }

  return (
    <DashboardLayout
      title="Gerenciar Pacientes"
      subtitle="Cadastre e gerencie os pacientes do sistema"
      allowedRoles={["ADMIN"]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <GlassCard className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-cyan-500/20"
                />
              </div>
              <Select value={filterMedico} onValueChange={setFilterMedico}>
                <SelectTrigger className="w-full md:w-[250px] bg-background/50 border-cyan-500/20">
                  <SelectValue placeholder="Filtrar por medico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Medicos</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Paciente
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-cyan-500/20 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Adicionar Novo Paciente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="bg-background/50 border-cyan-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background/50 border-cyan-500/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha</Label>
                      <Input
                        id="senha"
                        type="password"
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        className="bg-background/50 border-cyan-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                      <Input
                        id="dataNascimento"
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                        className="bg-background/50 border-cyan-500/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="genero">Genero</Label>
                      <Select
                        value={formData.genero}
                        onValueChange={(value) => setFormData({ ...formData, genero: value })}
                      >
                        <SelectTrigger className="bg-background/50 border-cyan-500/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {generos.map((g) => (
                            <SelectItem key={g.value} value={g.value}>
                              {g.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipoSanguineo">Tipo Sanguineo</Label>
                      <Select
                        value={formData.tipoSanguineo}
                        onValueChange={(value) => setFormData({ ...formData, tipoSanguineo: value })}
                      >
                        <SelectTrigger className="bg-background/50 border-cyan-500/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposSanguineos.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="bg-background/50 border-cyan-500/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereco</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      className="bg-background/50 border-cyan-500/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicoResponsavel">Medico Responsavel</Label>
                      <Select
                        value={formData.medicoResponsavel}
                        onValueChange={(value) => setFormData({ ...formData, medicoResponsavel: value })}
                      >
                        <SelectTrigger className="bg-background/50 border-cyan-500/20">
                          <SelectValue placeholder="Selecione um medico" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.nome} - {doctor.especialidade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contatoEmergencia">Contato de Emergencia</Label>
                      <Input
                        id="contatoEmergencia"
                        value={formData.contatoEmergencia}
                        onChange={(e) => setFormData({ ...formData, contatoEmergencia: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="bg-background/50 border-cyan-500/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alergias">Alergias (separadas por virgula)</Label>
                    <Input
                      id="alergias"
                      value={formData.alergias}
                      onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                      placeholder="Dipirona, Penicilina, Camarao"
                      className="bg-background/50 border-cyan-500/20"
                    />
                  </div>
                  <Button
                    onClick={handleAddPatient}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  >
                    Adicionar Paciente
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <User className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{patients.length}</p>
                <p className="text-sm text-muted-foreground">Total de Pacientes</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 border border-green-500/30">
                <User className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{patients.filter(p => p.ativo).length}</p>
                <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{patients.filter(p => p.alergias && p.alergias.length > 0).length}</p>
                <p className="text-sm text-muted-foreground">Com Alergias</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Patients Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-cyan-600 blur-md opacity-30" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400/20 to-cyan-600/20 border border-green-500/30">
                        <span className="text-lg font-bold text-green-400">
                          {patient.nome.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{patient.nome}</h3>
                      <p className="text-sm text-muted-foreground">{calculateAge(patient.dataNascimento)} anos</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      patient.ativo
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {patient.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  {patient.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{patient.telefone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(patient.dataNascimento).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4" />
                    <span>Tipo Sanguineo: {patient.tipoSanguineo}</span>
                  </div>
                </div>

                {patient.alergias && patient.alergias.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {patient.alergias.slice(0, 2).map((alergia, i) => (
                      <span
                        key={i}
                        className="inline-flex rounded-full px-2 py-0.5 text-xs bg-red-500/20 text-red-400 border border-red-500/30"
                      >
                        {alergia}
                      </span>
                    ))}
                    {patient.alergias.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{patient.alergias.length - 2}</span>
                    )}
                  </div>
                )}

                <div className="mt-2 text-xs text-muted-foreground">
                  Medico: {getMedicoNome(patient.medicoResponsavel)}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(patient)}
                    className="flex-1 border-cyan-500/20 hover:bg-cyan-500/10"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(patient)}
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <GlassCard className="p-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">Nenhum paciente encontrado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente ajustar os filtros ou adicione um novo paciente.
            </p>
          </GlassCard>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Editar Paciente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="edit-dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-genero">Genero</Label>
                  <Select
                    value={formData.genero}
                    onValueChange={(value) => setFormData({ ...formData, genero: value })}
                  >
                    <SelectTrigger className="bg-background/50 border-cyan-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {generos.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tipoSanguineo">Tipo Sanguineo</Label>
                  <Select
                    value={formData.tipoSanguineo}
                    onValueChange={(value) => setFormData({ ...formData, tipoSanguineo: value })}
                  >
                    <SelectTrigger className="bg-background/50 border-cyan-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposSanguineos.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-telefone">Telefone</Label>
                  <Input
                    id="edit-telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contatoEmergencia">Contato de Emergencia</Label>
                  <Input
                    id="edit-contatoEmergencia"
                    value={formData.contatoEmergencia}
                    onChange={(e) => setFormData({ ...formData, contatoEmergencia: e.target.value })}
                    className="bg-background/50 border-cyan-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endereco">Endereco</Label>
                <Input
                  id="edit-endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-medicoResponsavel">Medico Responsavel</Label>
                <Select
                  value={formData.medicoResponsavel}
                  onValueChange={(value) => setFormData({ ...formData, medicoResponsavel: value })}
                >
                  <SelectTrigger className="bg-background/50 border-cyan-500/20">
                    <SelectValue placeholder="Selecione um medico" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.nome} - {doctor.especialidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-alergias">Alergias (separadas por virgula)</Label>
                <Input
                  id="edit-alergias"
                  value={formData.alergias}
                  onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>
              <Button
                onClick={handleEditPatient}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                Salvar Alteracoes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-foreground">Confirmar Exclusao</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                Tem certeza que deseja excluir o paciente{" "}
                <span className="font-medium text-foreground">{selectedPatient?.nome}</span>?
              </p>
              <p className="mt-2 text-sm text-red-400">
                Esta acao nao pode ser desfeita e todos os registros medicos associados serao perdidos.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeletePatient}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Excluir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
