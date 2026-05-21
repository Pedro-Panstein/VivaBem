"use client"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"
import {
  Users,
  FileText,
  Calendar,
  AlertTriangle,
  Activity,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const activityData = [
  { name: "Seg", consultas: 4 },
  { name: "Ter", consultas: 6 },
  { name: "Qua", consultas: 8 },
  { name: "Qui", consultas: 5 },
  { name: "Sex", consultas: 7 },
  { name: "Sab", consultas: 3 },
  { name: "Dom", consultas: 0 },
]

export default function MedicoDashboard() {
  const { user } = useAuth()
  const { patients, medicalRecords, doctors, initializeData } = useDataStore()

  useEffect(() => {
    initializeData()
  }, [initializeData])

  // Get current doctor's patients
  const currentDoctor = doctors.find(d => d.id === user?.id)
  const myPatients = patients.filter(p => currentDoctor?.pacientes.includes(p.id))
  const myRecords = medicalRecords.filter(r => r.medicoId === user?.id)
  const criticalRecords = myRecords.filter(r => r.severidade === "ALTA" || r.severidade === "CRITICA")

  const stats = [
    {
      title: "Meus Pacientes",
      value: myPatients.length.toString(),
      icon: Users,
      color: "cyan",
      href: "/medico/pacientes",
    },
    {
      title: "Registros Criados",
      value: myRecords.length.toString(),
      icon: FileText,
      color: "blue",
      href: "/medico/registros",
    },
    {
      title: "Consultas Hoje",
      value: "3",
      icon: Calendar,
      color: "green",
      href: "/medico/monitoramento",
    },
    {
      title: "Alertas Criticos",
      value: criticalRecords.length.toString(),
      icon: AlertTriangle,
      color: "red",
      href: "/medico/pacientes",
    },
  ]

  return (
    <DashboardLayout
      title="Dashboard Medico"
      subtitle="Gerencie seus pacientes e registros"
      allowedRoles={["DOCTOR"]}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <GlassCard className="p-6 hover:border-cyan-500/40 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor:
                          stat.color === "cyan"
                            ? "rgba(34, 211, 238, 0.2)"
                            : stat.color === "blue"
                            ? "rgba(59, 130, 246, 0.2)"
                            : stat.color === "green"
                            ? "rgba(34, 197, 94, 0.2)"
                            : "rgba(239, 68, 68, 0.2)",
                        border: `1px solid ${
                          stat.color === "cyan"
                            ? "rgba(34, 211, 238, 0.3)"
                            : stat.color === "blue"
                            ? "rgba(59, 130, 246, 0.3)"
                            : stat.color === "green"
                            ? "rgba(34, 197, 94, 0.3)"
                            : "rgba(239, 68, 68, 0.3)"
                        }`,
                      }}
                    >
                      <stat.icon
                        className="h-6 w-6"
                        style={{
                          color:
                            stat.color === "cyan"
                              ? "#22d3ee"
                              : stat.color === "blue"
                              ? "#3b82f6"
                              : stat.color === "green"
                              ? "#22c55e"
                              : "#ef4444",
                        }}
                      />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Consultas da Semana
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.1)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 10, 15, 0.9)",
                        border: "1px solid rgba(34, 211, 238, 0.2)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="consultas"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorConsultas)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* My Patients List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Meus Pacientes
                </h3>
                <Link
                  href="/medico/pacientes"
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Ver todos
                </Link>
              </div>
              <div className="space-y-4">
                {myPatients.slice(0, 4).map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-4 rounded-lg bg-background/50 border border-cyan-500/10 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-500/30">
                      <span className="text-sm font-bold text-cyan-400">
                        {patient.nome.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {patient.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient.tipoSanguineo} - {new Date().getFullYear() - new Date(patient.dataNascimento).getFullYear()} anos
                      </p>
                    </div>
                  </div>
                ))}
                {myPatients.length === 0 && (
                  <div className="text-center py-6">
                    <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Nenhum paciente atribuido
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Critical Records */}
        {criticalRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6 border-red-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Registros que Requerem Atencao
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Registros com severidade alta ou critica
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {criticalRecords.slice(0, 6).map((record) => {
                  const patient = patients.find(p => p.id === record.pacienteId)
                  return (
                    <div key={record.id} className="rounded-lg bg-red-500/5 border border-red-500/20 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
                          <span className="text-sm font-bold text-red-400">
                            {patient?.nome.charAt(0) || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient?.nome || "Paciente"}</p>
                          <p className="text-xs text-red-400">
                            {record.titulo}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-red-400" />
                        <span className="text-xs text-muted-foreground">
                          {record.regiaoCorpo}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
