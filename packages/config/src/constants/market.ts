/** Marches de paris supportes (predictions, cotes, selections de coupon). */
export const MARKET_TYPES = [
  'MATCH_WINNER',
  'DOUBLE_CHANCE',
  'DRAW_NO_BET',
  'OVER_UNDER',
  'BTTS',
  'HANDICAP',
  'CORRECT_SCORE',
] as const;
export type MarketType = (typeof MARKET_TYPES)[number];
