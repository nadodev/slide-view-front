/**
 * @fileoverview Store de autenticação usando Zustand
 * Gerencia estado do usuário, token e autenticação
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  billing_cycle: string;
  features: Record<string, unknown>;
  max_slides: number | null;
  max_presentations: number | null;
  is_active: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: Plan | null;
  plan_expires_at: string | null;
  has_premium?: boolean;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  
  // Getters
  isAdmin: () => boolean;
  hasPremium: () => boolean;
  getPlanSlug: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      setLoading: (isLoading) => set({ isLoading }),

      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true,
        isLoading: false 
      }),

      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        isLoading: false 
      }),

      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),

      isAdmin: () => get().user?.role === 'admin',
      
      hasPremium: () => {
        const user = get().user;
        if (!user?.plan) return false;
        return user.plan.slug !== 'free';
      },

      getPlanSlug: () => get().user?.plan?.slug ?? 'free',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Hook helper para usar em componentes
export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
    isAdmin: store.isAdmin(),
    hasPremium: store.hasPremium(),
    planSlug: store.getPlanSlug(),
  };
};

