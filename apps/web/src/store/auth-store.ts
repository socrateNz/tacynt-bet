import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@tacynt/shared';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  hasHydrated: boolean;
  setSession: (session: { user: UserProfile; accessToken: string }) => void;
  setUser: (user: UserProfile) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,
      setSession: ({ user, accessToken }) => set({ user, accessToken }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ user: null, accessToken: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'tacynt-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    },
  ),
);
