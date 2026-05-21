'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserType } from '@/types';
import { useDataStore } from './use-data-store';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (email: string, senha: string) => { success: boolean; error?: string };
  logout: () => void;
  isUserType: (tipo: UserType) => boolean;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      
      login: (email: string, senha: string) => {
        // Initialize data store if needed
        const dataStore = useDataStore.getState();
        dataStore.initializeData();
        
        const user = dataStore.getUserByEmail(email);
        
        if (!user) {
          return { success: false, error: 'Usuario nao encontrado' };
        }
        
        if (user.senha !== senha) {
          return { success: false, error: 'Senha incorreta' };
        }
        
        if (!user.ativo) {
          return { success: false, error: 'Conta desativada. Entre em contato com o administrador.' };
        }
        
        set({ user, isAuthenticated: true });
        return { success: true };
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      isUserType: (tipo: UserType) => {
        const { user } = get();
        return user?.tipo === tipo;
      },
    }),
    {
      name: 'vivabem-auth',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
