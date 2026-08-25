import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MatchStatus } from '@tacynt/config';

interface MatchFiltersValues {
  sport?: string;
  competition?: string;
  date?: string;
  status?: MatchStatus;
  favoritesOnly: boolean;
}

interface MatchFiltersState extends MatchFiltersValues {
  setFilter: <K extends keyof MatchFiltersValues>(key: K, value: MatchFiltersValues[K]) => void;
  reset: () => void;
}

const defaults: MatchFiltersValues = {
  sport: undefined,
  competition: undefined,
  date: undefined,
  status: undefined,
  favoritesOnly: false,
};

export const useMatchFiltersStore = create<MatchFiltersState>()(
  persist(
    (set) => ({
      ...defaults,
      setFilter: (key, value) => set({ [key]: value } as Partial<MatchFiltersState>),
      reset: () => set(defaults),
    }),
    { name: 'tacynt-match-filters' },
  ),
);
