"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  User,
  Mail,
  Shield,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import type { User as UserType, Admin, Doctor, Patient } from "@/types"

export default function AdminUsuariosPage() {
  const { initializeData, getAllUsers, addUser, updateUser, deleteUser } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tipo: "PATIENT" as UserType["tipo"],
    senha: "",
  })

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const users = getAllUsers()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.tipo === filterRole
    return matchesSearch && matchesRole
  })

  const handleAddUser = () => {
    const baseUser = {
      id: `${formData.tipo.toLowerCase()}-${Date.now()}`,
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      tipo: formData.tipo,
      ativo: true,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    }

    if (formData.tipo === "ADMIN") {
      addUser(baseUser as Admin)
    } else if (formData.tipo === "DOCTOR") {
      addUser({
        ...baseUser,
        crm: "",
        especialidade: "Clinico Geral",
        pacientes: [],
      } as Doctor)
    } else {
      addUser({
        ...baseUser,
        dataNascimento: "1990-01-01",
        genero: "O" as const,
        alergias: [],
        medicamentos: [],
      } as Patient)
    }
    
    setIsAddDialogOpen(false)
    setFormData({ nome: "", email: "", tipo: "PATIENT", senha: "" })
  }

  const handleEditUser = () => {
    if (!selectedUser) return
    updateUser(selectedUser.id, {
      nome: formData.nome,
      email: formData.email,
    })
    setIsEditDialogOpen(false)
    setSelectedUser(null)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return
    deleteUser(selectedUser.id)
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const openEditDialog = (user: UserType) => {
    setSelectedUser(user)
    setFormData({ nome: user.nome, email: user.email, tipo: user.tipo, senha: "" })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: UserType) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DashboardLayout
      title="Gerenciar Usuarios"
      subtitle="CRUD completo de usuarios do sistema"
      allowedRoles={["ADMIN"]}
    >
      <div className="space-y-6">
        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-col gap-4 md:flex-row">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-cyan-500/20"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-cyan-500/20">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ADMIN">Administradores</SelectItem>
                    <SelectItem value="DOCTOR">Medicos</SelectItem>
                    <SelectItem value="PATIENT">Pacientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-cyan-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Adicionar Usuario</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Preencha os dados para criar um novo usuario
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
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
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        className="bg-background/50 border-cyan-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Tipo de Usuario</Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value: UserType["tipo"]) =>
                          setFormData({ ...formData, tipo: value })
                        }
                      >
                        <SelectTrigger className="bg-background/50 border-cyan-500/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                          <SelectItem value="DOCTOR">Medico</SelectItem>
                          <SelectItem value="PATIENT">Paciente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddUser}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600"
                    >
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </GlassCard>
        </motion.div>

        {/* Users Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-md opacity-30" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-500/30">
                        <span className="text-lg font-bold text-cyan-400">
                          {user.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{user.nome}</h3>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.tipo === "ADMIN"
                            ? "bg-purple-500/20 text-purple-400"
                            : user.tipo === "DOCTOR"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {user.tipo === "ADMIN"
                          ? "Administrador"
                          : user.tipo === "DOCTOR"
                          ? "Medico"
                          : "Paciente"}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    ID: {user.id.slice(0, 8)}...
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-cyan-500/20 hover:bg-cyan-500/10"
                    onClick={() => openEditDialog(user)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10"
                    onClick={() => openDeleteDialog(user)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <GlassCard className="p-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Nenhum usuario encontrado
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente ajustar os filtros ou adicione um novo usuario
            </p>
          </GlassCard>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-foreground">Editar Usuario</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Atualize as informacoes do usuario
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
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
              <div className="space-y-2">
                <Label htmlFor="edit-role">Tipo de Usuario</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value: UserType["tipo"]) =>
                    setFormData({ ...formData, tipo: value })
                  }
                  disabled
                >
                  <SelectTrigger className="bg-background/50 border-cyan-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="DOCTOR">Medico</SelectItem>
                    <SelectItem value="PATIENT">Paciente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleEditUser}
                className="bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                Salvar Alteracoes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-foreground">Confirmar Exclusao</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Tem certeza que deseja excluir o usuario{" "}
                <span className="font-medium text-foreground">{selectedUser?.nome}</span>?
                Esta acao nao pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteUser}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
