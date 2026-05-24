import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { useDataStore } from './use-data-store'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        const users = useDataStore.getState().users
        const user = users.find((u) => u.email === email)
        
        if (user) {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      register: async (userData) => {
        const { addUser } = useDataStore.getState()
        const users = useDataStore.getState().users
        
        // Check if email already exists
        if (users.some((u) => u.email === userData.email)) {
          return false
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          nome: userData.nome,
          email: userData.email,
          role: userData.role,
          cpf: userData.cpf,
          telefone: userData.telefone,
          dataNascimento: userData.dataNascimento,
          endereco: userData.endereco,
          crm: userData.crm,
          especialidade: userData.especialidade,
          createdAt: new Date().toISOString(),
        }

        addUser(newUser)
        set({ user: newUser, isAuthenticated: true })
        return true
      },
    }),
    {
      name: 'vivabem-auth',
    }
  )
)
