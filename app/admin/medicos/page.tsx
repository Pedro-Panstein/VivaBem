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
  Stethoscope,
  Mail,
  Phone,
  Users,
  Eye,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import type { Doctor } from "@/types"
import Link from "next/link"

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

export default function AdminMedicosPage() {
  const { doctors, patients, addDoctor, updateDoctor, deleteDoctor, initializeData } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEspecialidade, setFilterEspecialidade] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    crm: "",
    especialidade: "Cardiologia",
    telefone: "",
  })

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.crm.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEspecialidade =
      filterEspecialidade === "all" || doctor.especialidade === filterEspecialidade
    return matchesSearch && matchesEspecialidade
  })

  const handleAddDoctor = () => {
    const newDoctor: Doctor = {
      id: `doctor-${Date.now()}`,
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      tipo: "DOCTOR",
      ativo: true,
      crm: formData.crm,
      especialidade: formData.especialidade,
      telefone: formData.telefone,
      pacientes: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    }
    addDoctor(newDoctor)
    setIsAddDialogOpen(false)
    setFormData({ nome: "", email: "", senha: "", crm: "", especialidade: "Cardiologia", telefone: "" })
  }

  const handleEditDoctor = () => {
    if (!selectedDoctor) return
    updateDoctor(selectedDoctor.id, {
      nome: formData.nome,
      email: formData.email,
      crm: formData.crm,
      especialidade: formData.especialidade,
      telefone: formData.telefone,
    })
    setIsEditDialogOpen(false)
    setSelectedDoctor(null)
  }

  const handleDeleteDoctor = () => {
    if (!selectedDoctor) return
    deleteDoctor(selectedDoctor.id)
    setIsDeleteDialogOpen(false)
    setSelectedDoctor(null)
  }

  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setFormData({
      nome: doctor.nome,
      email: doctor.email,
      senha: "",
      crm: doctor.crm,
      especialidade: doctor.especialidade,
      telefone: doctor.telefone || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DashboardLayout
      title="Gerenciar Medicos"
      subtitle="Cadastre e gerencie os medicos do sistema"
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
                  placeholder="Buscar por nome, email ou CRM..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-cyan-500/20"
                />
              </div>
              <Select value={filterEspecialidade} onValueChange={setFilterEspecialidade}>
                <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-cyan-500/20">
                  <SelectValue placeholder="Especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp} value={esp}>
                      {esp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Medico
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-cyan-500/20">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Adicionar Novo Medico</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="crm">CRM</Label>
                      <Input
                        id="crm"
                        value={formData.crm}
                        onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                        placeholder="CRM/SP 123456"
                        className="bg-background/50 border-cyan-500/20"
                      />
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
                    <Label htmlFor="especialidade">Especialidade</Label>
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
                  <Button
                    onClick={handleAddDoctor}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  >
                    Adicionar Medico
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
                <Stethoscope className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{doctors.length}</p>
                <p className="text-sm text-muted-foreground">Total de Medicos</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 border border-green-500/30">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{doctors.filter(d => d.ativo).length}</p>
                <p className="text-sm text-muted-foreground">Medicos Ativos</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{patients.length}</p>
                <p className="text-sm text-muted-foreground">Pacientes Atendidos</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Doctors Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 blur-md opacity-30" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-600/20 border border-blue-500/30">
                        <span className="text-lg font-bold text-blue-400">
                          {doctor.nome.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{doctor.nome}</h3>
                      <p className="text-sm text-cyan-400">{doctor.especialidade}</p>
                      <p className="text-xs text-muted-foreground">{doctor.crm}</p>
                    </div>
                  </div>
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

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{doctor.email}</span>
                  </div>
                  {doctor.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{doctor.telefone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{doctor.pacientes.length} pacientes</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/admin/medicos/${doctor.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-cyan-500/20 hover:bg-cyan-500/10"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Detalhes
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(doctor)}
                    className="flex-1 border-cyan-500/20 hover:bg-cyan-500/10"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(doctor)}
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">Nenhum medico encontrado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente ajustar os filtros ou adicione um novo medico.
            </p>
          </GlassCard>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20">
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
              <Button
                onClick={handleEditDoctor}
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
                Tem certeza que deseja excluir o medico{" "}
                <span className="font-medium text-foreground">{selectedDoctor?.nome}</span>?
              </p>
              <p className="mt-2 text-sm text-red-400">
                Esta acao nao pode ser desfeita.
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
                onClick={handleDeleteDoctor}
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
