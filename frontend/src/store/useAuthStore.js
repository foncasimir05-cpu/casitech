import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../lib/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user:  null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await authAPI.login({ email, password });
        localStorage.setItem('casitech_token', data.token);
        set({ user: data.user, token: data.token, isAuthenticated: true });
        return data;
      },

      register: async (name, email, password, phone) => {
        const { data } = await authAPI.register({ name, email, password, phone });
        localStorage.setItem('casitech_token', data.token);
        set({ user: data.user, token: data.token, isAuthenticated: true });
        return data;
      },

      logout: () => {
        localStorage.removeItem('casitech_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'casitech-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        if (state) state.isAuthenticated = !!(state.user && state.token);
      },
    }
  )
);

export default useAuthStore;
