/** Profil de risque choisi par l'utilisateur pour la generation de coupons. */
export const RISK_PROFILES = ['PRUDENT', 'EQUILIBRE', 'AUDACIEUX'] as const;
export type RiskProfile = (typeof RISK_PROFILES)[number];

export const RISK_PROFILE_LABELS: Record<RiskProfile, string> = {
  PRUDENT: 'Prudent',
  EQUILIBRE: 'Equilibre',
  AUDACIEUX: 'Audacieux',
};

/** Niveau de risque estime par l'IA pour un pronostic individuel. */
export const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  LOW: 'Faible',
  MEDIUM: 'Modere',
  HIGH: 'Eleve',
  VERY_HIGH: 'Tres eleve',
};
