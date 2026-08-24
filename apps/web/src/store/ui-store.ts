import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  isMobileNavOpen: boolean;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

/** Etat d'interface global (non persiste) : navigation, panneaux. */
export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isMobileNavOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
}));
