"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { HumanBody } from "@/components/human-body"
import { motion } from "framer-motion"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Info,
  AlertTriangle,
  Activity,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDataStore } from "@/hooks/use-data-store"
import { useAuth } from "@/hooks/use-auth"
import type { BodyRegion } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const regionLabels: Record<string, string> = {
  head: "Cabeca", brain: "Cerebro", eyes: "Olhos", neck: "Pescoco",
  chest: "Torax", heart: "Coracao", lungs: "Pulmoes", stomach: "Estomago",
  liver: "Figado", kidneys: "Rins", "left-arm": "Braco Esquerdo",
  "right-arm": "Braco Direito", "left-hand": "Mao Esquerda",
  "right-hand": "Mao Direita", "left-leg": "Perna Esquerda",
  "right-leg": "Perna Direita", "left-foot": "Pe Esquerdo",
  "right-foot": "Pe Direito", spine: "Coluna",
}

export default function CorpoHumanoPage() {
  const { user } = useAuth()
  const { patients } = useDataStore()
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [zoom, setZoom] = useState(1)

  const patientData = patients.find((p) => p.email === user?.email) || patients[0]
  const bodyRegions = patientData?.regioesCorporais || []

  const handleRegionClick = (region: BodyRegion) => {
    setSelectedRegion(region)
    setIsModalOpen(true)
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6))
  const handleReset = () => setZoom(1)

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
      title="Corpo Humano Interativo"
      subtitle="Visualize e explore suas condicoes de saude"
      allowedRoles={["PATIENT"]}
    >
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Body Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <GlassCard className="relative overflow-hidden p-6">
            {/* Controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                className="h-10 w-10 border-cyan-500/20 bg-background/50 backdrop-blur-sm hover:bg-cyan-500/10"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                className="h-10 w-10 border-cyan-500/20 bg-background/50 backdrop-blur-sm hover:bg-cyan-500/10"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="h-10 w-10 border-cyan-500/20 bg-background/50 backdrop-blur-sm hover:bg-cyan-500/10"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>

            {/* Zoom indicator */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-background/50 backdrop-blur-sm border border-cyan-500/20 px-3 py-1.5 text-xs text-muted-foreground">
                <Maximize2 className="h-3 w-3" />
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Body Container */}
            <div
              className="flex items-center justify-center py-8 transition-transform duration-300"
              style={{ transform: `scale(${zoom})` }}
            >
              <HumanBody
                regions={bodyRegions}
                onRegionClick={handleRegionClick}
                interactive
                size="lg"
              />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4" />
                Clique nas areas marcadas para ver detalhes da condicao
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Stats */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Resumo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Critico</span>
                </div>
                <span className="font-medium text-foreground">
                  {bodyRegions.filter((r) => r.severidade === "CRITICAL").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-muted-foreground">Atencao</span>
                </div>
                <span className="font-medium text-foreground">
                  {bodyRegions.filter((r) => r.severidade === "WARNING").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Normal</span>
                </div>
                <span className="font-medium text-foreground">
                  {bodyRegions.filter((r) => r.severidade === "NORMAL").length}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Conditions List */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Condicoes Ativas
            </h3>
            {bodyRegions.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {bodyRegions.map((region) => {
                  const colors = getSeverityColor(region.severidade)
                  const Icon =
                    region.severidade === "CRITICAL"
                      ? AlertTriangle
                      : region.severidade === "WARNING"
                      ? Activity
                      : CheckCircle

                  return (
                    <button
                      key={region.id}
                      onClick={() => handleRegionClick(region)}
                      className={`w-full text-left rounded-lg p-3 ${colors.bg} border ${colors.border} hover:opacity-80 transition-opacity`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${colors.text}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {regionLabels[region.regiao] || region.regiao}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {region.condicao}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(region.ultimaAtualizacao).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-10 w-10 text-green-400" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Tudo em ordem!
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Region Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="glass-card border-cyan-500/20 max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-foreground">
                {selectedRegion && (
                  <>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        selectedRegion.severidade === "CRITICAL"
                          ? "bg-red-500/20 border border-red-500/30"
                          : selectedRegion.severidade === "WARNING"
                          ? "bg-yellow-500/20 border border-yellow-500/30"
                          : "bg-green-500/20 border border-green-500/30"
                      }`}
                    >
                      {selectedRegion.severidade === "CRITICAL" ? (
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                      ) : selectedRegion.severidade === "WARNING" ? (
                        <Activity className="h-6 w-6 text-yellow-400" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-xl">{regionLabels[selectedRegion.regiao] || selectedRegion.regiao}</p>
                      <p className="text-sm font-normal text-muted-foreground">
                        Regiao do corpo monitorada
                      </p>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedRegion && (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-background/50 border border-cyan-500/10 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Condicao</p>
                    <p className="font-medium text-foreground">{selectedRegion.condicao}</p>
                  </div>
                  <div className="rounded-lg bg-background/50 border border-cyan-500/10 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        selectedRegion.severidade === "CRITICAL"
                          ? "bg-red-500/20 text-red-400"
                          : selectedRegion.severidade === "WARNING"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {selectedRegion.severidade === "CRITICAL"
                        ? "Critico"
                        : selectedRegion.severidade === "WARNING"
                        ? "Atencao"
                        : "Normal"}
                    </span>
                  </div>
                </div>

                {selectedRegion.observacoes && (
                  <div className="rounded-lg bg-background/50 border border-cyan-500/10 p-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      Observacoes do Medico
                    </p>
                    <p className="text-foreground">{selectedRegion.observacoes}</p>
                  </div>
                )}

                <div className="rounded-lg bg-background/50 border border-cyan-500/10 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Ultima Atualizacao</p>
                  <p className="text-foreground">
                    {new Date(selectedRegion.ultimaAtualizacao).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {selectedRegion.severidade !== "NORMAL" && (
                  <div
                    className={`rounded-lg p-4 ${
                      selectedRegion.severidade === "CRITICAL"
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-yellow-500/10 border border-yellow-500/20"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium mb-2 ${
                        selectedRegion.severidade === "CRITICAL" ? "text-red-400" : "text-yellow-400"
                      }`}
                    >
                      {selectedRegion.severidade === "CRITICAL" ? "Atencao Urgente" : "Recomendacoes"}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedRegion.severidade === "CRITICAL" ? (
                        <>
                          <li>- Entre em contato com seu medico imediatamente</li>
                          <li>- Siga todas as prescricoes indicadas</li>
                          <li>- Evite esforcos e mantenha repouso</li>
                        </>
                      ) : (
                        <>
                          <li>- Mantenha o acompanhamento regular</li>
                          <li>- Siga as orientacoes medicas</li>
                          <li>- Observe qualquer mudanca nos sintomas</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
