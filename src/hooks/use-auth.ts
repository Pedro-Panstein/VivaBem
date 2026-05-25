import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { useDataStore } from './use-data-store'

interface LoginResult {
  success: boolean
  error?: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => LoginResult
  logout: () => void
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, _password: string): LoginResult => {
        const users = useDataStore.getState().users
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        
        if (user) {
          set({ user, isAuthenticated: true })
          return { success: true }
        }
        return { success: false, error: 'Email ou senha invalidos' }
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
