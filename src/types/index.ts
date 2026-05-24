export interface User {
  id: string
  nome: string
  email: string
  role: 'paciente' | 'medico' | 'admin'
  avatar?: string
  cpf?: string
  telefone?: string
  dataNascimento?: string
  endereco?: string
  crm?: string
  especialidade?: string
  createdAt: string
}

export interface Sintoma {
  id: string
  pacienteId: string
  descricao: string
  intensidade: number
  localizacao: string
  dataRegistro: string
  observacoes?: string
  status: 'pendente' | 'analisado' | 'resolvido'
}

export interface Consulta {
  id: string
  pacienteId: string
  medicoId: string
  data: string
  horario: string
  tipo: 'presencial' | 'telemedicina'
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada'
  observacoes?: string
  diagnostico?: string
  prescricao?: string
}

export interface Medicamento {
  id: string
  pacienteId: string
  nome: string
  dosagem: string
  frequencia: string
  horarios: string[]
  dataInicio: string
  dataFim?: string
  observacoes?: string
  ativo: boolean
}

export interface Exame {
  id: string
  pacienteId: string
  tipo: string
  data: string
  resultado?: string
  arquivo?: string
  status: 'pendente' | 'concluido'
  observacoes?: string
}

export interface Notificacao {
  id: string
  userId: string
  titulo: string
  mensagem: string
  tipo: 'info' | 'alerta' | 'sucesso' | 'erro'
  lida: boolean
  createdAt: string
}

export interface SystemSettings {
  maintenanceMode: boolean
  maintenanceMessage?: string
  systemName: string
  allowRegistrations: boolean
  maxUsersPerDoctor: number
}

export interface DashboardStats {
  totalPacientes: number
  totalMedicos: number
  consultasHoje: number
  consultasSemana: number
  sintomasReportados: number
  examesPendentes: number
}

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
}
