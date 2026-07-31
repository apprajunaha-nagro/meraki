import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types/index';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  login: (user: AuthUser, token?: string) => void;
  loginAdmin: (user: AuthUser, token?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdminAuthenticated: false,

      login: (user, token) => {
        if (token) {
          localStorage.setItem('meraki_token', token);
        }
        set({ user, isAuthenticated: true });
      },

      loginAdmin: (user, token) => {
        if (token) {
          localStorage.setItem('meraki_token', token);
        }
        set({ user, isAuthenticated: true, isAdminAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('meraki_token');
        set({ user: null, isAuthenticated: false, isAdminAuthenticated: false });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'meraki-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdminAuthenticated: state.isAdminAuthenticated,
      }),
    }
  )
);
