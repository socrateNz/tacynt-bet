export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  /** Utilise quand Gemini n'a pas assez de donnees pour repondre sur un point precis. */
  DATA_UNAVAILABLE: 'DATA_UNAVAILABLE',
  /** Limite quotidienne d'analyses IA atteinte pour le plan de l'utilisateur. */
  AI_LIMIT_REACHED: 'AI_LIMIT_REACHED',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
