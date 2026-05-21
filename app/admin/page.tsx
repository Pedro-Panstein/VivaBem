"use client"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"
import {
  Users,
  Stethoscope,
  UserCheck,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const chartData = [
  { name: "Jan", usuarios: 120, consultas: 80 },
  { name: "Fev", usuarios: 150, consultas: 95 },
  { name: "Mar", usuarios: 180, consultas: 120 },
  { name: "Abr", usuarios: 220, consultas: 150 },
  { name: "Mai", usuarios: 280, consultas: 180 },
  { name: "Jun", usuarios: 350, consultas: 220 },
]

const recentActivity = [
  { user: "Dr. Carlos Silva", action: "Registrou novo paciente", time: "2 min atras" },
  { user: "Maria Santos", action: "Atualizou perfil", time: "15 min atras" },
  { user: "Dr. Ana Oliveira", action: "Criou registro medico", time: "1 hora atras" },
  { user: "Joao Pereira", action: "Completou check-up", time: "2 horas atras" },
]

export default function AdminDashboard() {
  const { admins, doctors, patients, medicalRecords, initializeData, getAllUsers } = useDataStore()

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const allUsers = getAllUsers()

  const stats = [
    {
      title: "Total de Usuarios",
      value: allUsers.length.toString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "cyan",
    },
    {
      title: "Medicos Ativos",
      value: doctors.length.toString(),
      change: "+5%",
      trend: "up",
      icon: Stethoscope,
      color: "blue",
    },
    {
      title: "Pacientes",
      value: patients.length.toString(),
      change: "+18%",
      trend: "up",
      icon: UserCheck,
      color: "green",
    },
    {
      title: "Registros Medicos",
      value: medicalRecords.length.toString(),
      change: "-3%",
      trend: "down",
      icon: Activity,
      color: "purple",
    },
  ]

  return (
    <DashboardLayout
      title="Dashboard Administrativo"
      subtitle="Visao geral do sistema"
      allowedRoles={["ADMIN"]}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${stat.color}-500/20 border border-${stat.color}-500/30`}
                    style={{
                      backgroundColor:
                        stat.color === "cyan"
                          ? "rgba(34, 211, 238, 0.2)"
                          : stat.color === "blue"
                          ? "rgba(59, 130, 246, 0.2)"
                          : stat.color === "green"
                          ? "rgba(34, 197, 94, 0.2)"
                          : "rgba(168, 85, 247, 0.2)",
                      borderColor:
                        stat.color === "cyan"
                          ? "rgba(34, 211, 238, 0.3)"
                          : stat.color === "blue"
                          ? "rgba(59, 130, 246, 0.3)"
                          : stat.color === "green"
                          ? "rgba(34, 197, 94, 0.3)"
                          : "rgba(168, 85, 247, 0.3)",
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
                            : "#a855f7",
                      }}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.trend === "up" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Crescimento de Usuarios
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
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
                    <Line
                      type="monotone"
                      dataKey="usuarios"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      dot={{ fill: "#22d3ee", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Consultas por Mes
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
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
                    <Bar dataKey="consultas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Recent Activity & Users Table */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Usuarios Recentes
                </h3>
                <a
                  href="/admin/usuarios"
                  className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Ver todos
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-500/20">
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                        Nome
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                        Tipo
                      </th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.slice(0, 5).map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-cyan-500/10 last:border-0"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-500/30">
                              <span className="text-sm font-medium text-cyan-400">
                                {user.nome.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {user.nome}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
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
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
                            <span className="h-2 w-2 rounded-full bg-green-400" />
                            Ativo
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Atividade Recente
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 border-b border-cyan-500/10 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                      <Activity className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action}
                      </p>
                      <p className="mt-1 text-xs text-cyan-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
