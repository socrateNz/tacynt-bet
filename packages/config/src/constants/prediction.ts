/** Resultat reel d'un pronostic individuel, une fois le match termine. */
export const PREDICTION_OUTCOMES = ['PENDING', 'WON', 'LOST', 'VOID'] as const;
export type PredictionOutcome = (typeof PREDICTION_OUTCOMES)[number];
