import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Sintoma, Consulta, Medicamento, Exame, Notificacao } from '../types'
import { mockUsers, mockSintomas, mockConsultas, mockMedicamentos, mockExames, mockNotificacoes } from '../data/mock-data'

interface DataStore {
  // Users
  users: User[]
  addUser: (user: User) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  
  // Sintomas
  sintomas: Sintoma[]
  addSintoma: (sintoma: Sintoma) => void
  updateSintoma: (id: string, data: Partial<Sintoma>) => void
  deleteSintoma: (id: string) => void
  
  // Consultas
  consultas: Consulta[]
  addConsulta: (consulta: Consulta) => void
  updateConsulta: (id: string, data: Partial<Consulta>) => void
  deleteConsulta: (id: string) => void
  
  // Medicamentos
  medicamentos: Medicamento[]
  addMedicamento: (medicamento: Medicamento) => void
  updateMedicamento: (id: string, data: Partial<Medicamento>) => void
  deleteMedicamento: (id: string) => void
  
  // Exames
  exames: Exame[]
  addExame: (exame: Exame) => void
  updateExame: (id: string, data: Partial<Exame>) => void
  deleteExame: (id: string) => void
  
  // Notificacoes
  notificacoes: Notificacao[]
  addNotificacao: (notificacao: Notificacao) => void
  markAsRead: (id: string) => void
  deleteNotificacao: (id: string) => void
  
  // Initialize
  initializeData: () => void
  isInitialized: boolean
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      users: [],
      sintomas: [],
      consultas: [],
      medicamentos: [],
      exames: [],
      notificacoes: [],
      isInitialized: false,

      initializeData: () => {
        if (!get().isInitialized) {
          set({
            users: mockUsers,
            sintomas: mockSintomas,
            consultas: mockConsultas,
            medicamentos: mockMedicamentos,
            exames: mockExames,
            notificacoes: mockNotificacoes,
            isInitialized: true,
          })
        }
      },

      // Users
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      // Sintomas
      addSintoma: (sintoma) =>
        set((state) => ({ sintomas: [...state.sintomas, sintoma] })),
      updateSintoma: (id, data) =>
        set((state) => ({
          sintomas: state.sintomas.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),
      deleteSintoma: (id) =>
        set((state) => ({
          sintomas: state.sintomas.filter((s) => s.id !== id),
        })),

      // Consultas
      addConsulta: (consulta) =>
        set((state) => ({ consultas: [...state.consultas, consulta] })),
      updateConsulta: (id, data) =>
        set((state) => ({
          consultas: state.consultas.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteConsulta: (id) =>
        set((state) => ({
          consultas: state.consultas.filter((c) => c.id !== id),
        })),

      // Medicamentos
      addMedicamento: (medicamento) =>
        set((state) => ({ medicamentos: [...state.medicamentos, medicamento] })),
      updateMedicamento: (id, data) =>
        set((state) => ({
          medicamentos: state.medicamentos.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        })),
      deleteMedicamento: (id) =>
        set((state) => ({
          medicamentos: state.medicamentos.filter((m) => m.id !== id),
        })),

      // Exames
      addExame: (exame) => set((state) => ({ exames: [...state.exames, exame] })),
      updateExame: (id, data) =>
        set((state) => ({
          exames: state.exames.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),
      deleteExame: (id) =>
        set((state) => ({
          exames: state.exames.filter((e) => e.id !== id),
        })),

      // Notificacoes
      addNotificacao: (notificacao) =>
        set((state) => ({ notificacoes: [...state.notificacoes, notificacao] })),
      markAsRead: (id) =>
        set((state) => ({
          notificacoes: state.notificacoes.map((n) =>
            n.id === id ? { ...n, lida: true } : n
          ),
        })),
      deleteNotificacao: (id) =>
        set((state) => ({
          notificacoes: state.notificacoes.filter((n) => n.id !== id),
        })),
    }),
    {
      name: 'vivabem-data-store',
    }
  )
)
