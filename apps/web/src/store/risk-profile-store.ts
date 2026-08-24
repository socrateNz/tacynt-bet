import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RiskProfile } from '@tacynt/config';

interface RiskProfileState {
  riskProfile: RiskProfile;
  setRiskProfile: (profile: RiskProfile) => void;
}

/** Preference de profil de risque, persistee entre les sessions (localStorage). */
export const useRiskProfileStore = create<RiskProfileState>()(
  persist(
    (set) => ({
      riskProfile: 'EQUILIBRE',
      setRiskProfile: (riskProfile) => set({ riskProfile }),
    }),
    { name: 'tacynt-risk-profile' },
  ),
);
