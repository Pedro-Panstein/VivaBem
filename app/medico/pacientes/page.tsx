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
  Eye,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import type { BodyRegion } from "@/types"
import Link from "next/link"

const bodyRegionOptions = [
  "head", "brain", "eyes", "neck", "chest", "heart", "lungs", "stomach",
  "liver", "kidneys", "left-arm", "right-arm", "left-hand", "right-hand",
  "left-leg", "right-leg", "left-foot", "right-foot", "spine",
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

export default function MedicoPacientesPage() {
  const { patients, updatePatient } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [isAddRegionDialogOpen, setIsAddRegionDialogOpen] = useState(false)
  const [newRegion, setNewRegion] = useState({
    regiao: "head",
    severidade: "NORMAL",
    condicao: "",
    observacoes: "",
  })

  const filteredPatients = patients.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedPatient = patients.find(p => p.id === selectedPatientId)

  const handleAddRegion = () => {
    if (!selectedPatient || !newRegion.condicao) return

    const region: BodyRegion = {
      id: `region-${Date.now()}`,
      regiao: newRegion.regiao as BodyRegion["regiao"],
      severidade: newRegion.severidade as BodyRegion["severidade"],
      condicao: newRegion.condicao,
      observacoes: newRegion.observacoes,
      ultimaAtualizacao: new Date().toISOString(),
    }

    const updatedRegions = [...(selectedPatient.regioesCorporais || []), region]
    updatePatient(selectedPatient.id, { regioesCorporais: updatedRegions })

    setIsAddRegionDialogOpen(false)
    setNewRegion({ regiao: "head", severidade: "NORMAL", condicao: "", observacoes: "" })
    setSelectedPatientId(null)
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
      title="Meus Pacientes"
      subtitle="Gerencie e monitore seus pacientes"
      allowedRoles={["DOCTOR"]}
    >
      <div className="space-y-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar pacientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-cyan-500/20"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Patients Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredPatients.map((patient, index) => {
            const bodyRegions = patient.regioesCorporais || []
            const criticalCount = bodyRegions.filter(
              (r) => r.severidade === "CRITICAL"
            ).length
            const warningCount = bodyRegions.filter(
              (r) => r.severidade === "WARNING"
            ).length

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-6 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-md opacity-30" />
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-500/30">
                          <span className="text-lg font-bold text-cyan-400">
                            {patient.nome.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{patient.nome}</h3>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.tipoSanguineo || "Tipo sanguineo nao informado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {criticalCount > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400">
                          <AlertTriangle className="h-3 w-3" />
                          {criticalCount}
                        </span>
                      )}
                      {warningCount > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-400">
                          <Activity className="h-3 w-3" />
                          {warningCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Regions */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      Regioes Monitoradas ({bodyRegions.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bodyRegions.slice(0, 4).map((region) => {
                        const colors = getSeverityColor(region.severidade)
                        return (
                          <span
                            key={region.id}
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${colors.bg} ${colors.text} border ${colors.border}`}
                          >
                            <Heart className="h-3 w-3" />
                            {regionLabels[region.regiao] || region.regiao}
                          </span>
                        )
                      })}
                      {bodyRegions.length > 4 && (
                        <span className="text-xs text-muted-foreground">
                          +{bodyRegions.length - 4} mais
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/medico/pacientes/${patient.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-cyan-500/20 hover:bg-cyan-500/10"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-cyan-500/20 hover:bg-cyan-500/10"
                      onClick={() => {
                        setSelectedPatientId(patient.id)
                        setIsAddRegionDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {filteredPatients.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Nenhum paciente encontrado
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente ajustar sua busca
            </p>
          </GlassCard>
        )}

        {/* Add Region Dialog */}
        <Dialog open={isAddRegionDialogOpen} onOpenChange={setIsAddRegionDialogOpen}>
          <DialogContent className="glass-card border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Adicionar Registro Medico
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Marque uma regiao do corpo para {selectedPatient?.nome}
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
                  onChange={(e) =>
                    setNewRegion({ ...newRegion, condicao: e.target.value })
                  }
                  placeholder="Ex: Inflamacao muscular"
                  className="bg-background/50 border-cyan-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Observacoes</Label>
                <Textarea
                  value={newRegion.observacoes}
                  onChange={(e) => setNewRegion({ ...newRegion, observacoes: e.target.value })}
                  placeholder="Notas adicionais..."
                  className="bg-background/50 border-cyan-500/20 min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddRegionDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddRegion}
                className="bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
