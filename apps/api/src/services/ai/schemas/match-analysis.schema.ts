import { z } from 'zod';
import { MARKET_TYPES, RISK_LEVELS } from '@tacynt/config';

export const aiPredictionSchema = z.object({
  market: z.enum(MARKET_TYPES),
  selection: z.string().min(1),
  confidence: z.number().min(0).max(100),
  risk: z.enum(RISK_LEVELS),
  reason: z.string().min(1),
});

export const matchAnalysisResponseSchema = z.object({
  summary: z.string().min(1),
  favorableFactors: z.array(z.string()).max(6),
  riskFactors: z.array(z.string()).max(6),
  confidence: z.number().min(0).max(100),
  risk: z.enum(RISK_LEVELS),
  predictions: z.array(aiPredictionSchema).min(1).max(5),
});

export type MatchAnalysisResponse = z.infer<typeof matchAnalysisResponseSchema>;
