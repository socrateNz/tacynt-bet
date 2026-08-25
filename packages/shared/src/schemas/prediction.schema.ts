import { z } from 'zod';
import { MARKET_TYPES, RISK_LEVELS } from '@tacynt/config';

export const predictionQuerySchema = z.object({
  matchId: z.string().min(1).optional(),
  market: z.enum(MARKET_TYPES).optional(),
  risk: z.enum(RISK_LEVELS).optional(),
  minConfidence: z.coerce.number().min(0).max(100).optional(),
  upcomingOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
export type PredictionQueryInput = z.infer<typeof predictionQuerySchema>;
