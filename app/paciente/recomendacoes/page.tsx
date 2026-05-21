"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"
import {
  Heart,
  Activity,
  Apple,
  Moon,
  Dumbbell,
  Droplets,
  Brain,
  Wind,
  Sun,
  CheckCircle,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import { useAuth } from "@/hooks/use-auth"

const generalRecommendations = [
  {
    icon: Activity,
    title: "Exercicio Regular",
    description: "Pratique pelo menos 30 minutos de atividade fisica moderada diariamente.",
    category: "Atividade Fisica",
    color: "cyan",
  },
  {
    icon: Apple,
    title: "Alimentacao Balanceada",
    description: "Mantenha uma dieta rica em frutas, vegetais e proteinas magras.",
    category: "Nutricao",
    color: "green",
  },
  {
    icon: Moon,
    title: "Sono de Qualidade",
    description: "Durma de 7 a 9 horas por noite para recuperacao adequada.",
    category: "Descanso",
    color: "blue",
  },
  {
    icon: Droplets,
    title: "Hidratacao",
    description: "Beba pelo menos 2 litros de agua por dia.",
    category: "Hidratacao",
    color: "cyan",
  },
  {
    icon: Brain,
    title: "Saude Mental",
    description: "Reserve tempo para relaxamento e atividades que voce gosta.",
    category: "Bem-estar",
    color: "purple",
  },
  {
    icon: Sun,
    title: "Exposicao Solar",
    description: "Tome sol moderadamente para sintese de vitamina D.",
    category: "Vitaminas",
    color: "yellow",
  },
]

const regionLabels: Record<string, string> = {
  head: "Cabeca", brain: "Cerebro", eyes: "Olhos", neck: "Pescoco",
  chest: "Torax", heart: "Coracao", lungs: "Pulmoes", stomach: "Estomago",
  liver: "Figado", kidneys: "Rins", "left-arm": "Braco Esquerdo",
  "right-arm": "Braco Direito", "left-hand": "Mao Esquerda",
  "right-hand": "Mao Direita", "left-leg": "Perna Esquerda",
  "right-leg": "Perna Direita", "left-foot": "Pe Esquerdo",
  "right-foot": "Pe Direito", spine: "Coluna",
}

const regionRecommendations: Record<string, string[]> = {
  heart: [
    "Evite alimentos ricos em gordura saturada",
    "Pratique exercicios cardiovasculares regulares",
    "Monitore sua pressao arterial semanalmente",
    "Reduza o consumo de sal",
  ],
  lungs: [
    "Evite exposicao a poluentes e fumaca",
    "Pratique exercicios respiratorios",
    "Mantenha ambientes bem ventilados",
  ],
  head: [
    "Evite estresse excessivo",
    "Mantenha horarios regulares de sono",
    "Faca pausas durante trabalho em telas",
  ],
  spine: [
    "Mantenha postura adequada",
    "Faca alongamentos diarios",
    "Use moveis ergonomicos",
    "Evite carregar peso excessivo",
  ],
  eyes: [
    "Faca pausas regulares ao usar telas",
    "Use oculos de sol ao ar livre",
    "Mantenha consultas oftalmologicas em dia",
  ],
  stomach: [
    "Evite comer muito rapido",
    "Faca refeicoes em horarios regulares",
    "Evite deitar logo apos comer",
  ],
  default: [
    "Siga as orientacoes do seu medico",
    "Mantenha o acompanhamento regular",
    "Observe qualquer mudanca nos sintomas",
  ],
}

export default function RecomendacoesPage() {
  const { user } = useAuth()
  const { patients } = useDataStore()
  
  const patientData = patients.find((p) => p.email === user?.email) || patients[0]
  const bodyRegions = patientData?.regioesCorporais || []

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500/30", text: "text-cyan-400" },
      green: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400" },
      blue: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400" },
      purple: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400" },
      yellow: { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400" },
      red: { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400" },
    }
    return colors[color] || colors.cyan
  }

  const conditionsWithRecommendations = bodyRegions.filter(
    (r) => r.severidade !== "NORMAL"
  )

  return (
    <DashboardLayout
      title="Recomendacoes de Saude"
      subtitle="Dicas personalizadas para melhorar sua qualidade de vida"
      allowedRoles={["PATIENT"]}
    >
      <div className="space-y-6">
        {/* Specific Recommendations based on conditions */}
        {conditionsWithRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6 border-cyan-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                  <Heart className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Recomendacoes Personalizadas
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Baseadas nas suas condicoes monitoradas
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {conditionsWithRecommendations.map((region, index) => {
                  const recommendations =
                    regionRecommendations[region.regiao] || regionRecommendations.default
                  const isCritical = region.severidade === "CRITICAL"

                  return (
                    <motion.div
                      key={region.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`rounded-lg p-4 ${
                        isCritical
                          ? "bg-red-500/10 border border-red-500/20"
                          : "bg-yellow-500/10 border border-yellow-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Activity
                          className={`h-5 w-5 ${
                            isCritical ? "text-red-400" : "text-yellow-400"
                          }`}
                        />
                        <h4 className="font-medium text-foreground">
                          {regionLabels[region.regiao] || region.regiao} - {region.condicao}
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle
                              className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                                isCritical ? "text-red-400" : "text-yellow-400"
                              }`}
                            />
                            <span className="text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* General Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Recomendacoes Gerais de Saude
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {generalRecommendations.map((rec, index) => {
              const colors = getColorClasses(rec.color)
              return (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <GlassCard className="p-6 h-full hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${colors.bg} border ${colors.border}`}
                      >
                        <rec.icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          {rec.category}
                        </span>
                        <h4 className="font-medium text-foreground">{rec.title}</h4>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Daily Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                <Dumbbell className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Checklist Diario
                </h3>
                <p className="text-sm text-muted-foreground">
                  Habitos para manter sua saude em dia
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Tomar cafe da manha", icon: Apple },
                { label: "Beber 8 copos de agua", icon: Droplets },
                { label: "30 min de exercicio", icon: Activity },
                { label: "Dormir 8 horas", icon: Moon },
                { label: "Comer frutas/vegetais", icon: Apple },
                { label: "Evitar ultraprocessados", icon: Wind },
                { label: "Momento de relaxamento", icon: Brain },
                { label: "Tomar medicamentos", icon: Heart },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg bg-background/50 border border-cyan-500/10 p-3 hover:border-cyan-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                    <item.icon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
