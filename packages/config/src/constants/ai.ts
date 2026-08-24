import type { UserPlan } from './user';

/** Operations tracees dans AIUsageLog, correspondant aux methodes d'AIService. */
export const AI_OPERATIONS = [
  'MATCH_ANALYSIS',
  'COUPON_GENERATION',
  'PREDICTION_EXPLANATION',
] as const;
export type AiOperation = (typeof AI_OPERATIONS)[number];

/** Limite d'analyses IA par jour, selon le plan utilisateur. */
export const AI_DAILY_LIMITS: Record<UserPlan, number> = {
  FREE: 5,
  PREMIUM: 50,
};
