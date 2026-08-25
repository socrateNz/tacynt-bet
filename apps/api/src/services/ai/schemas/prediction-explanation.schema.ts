import { z } from 'zod';

export const predictionExplanationResponseSchema = z.object({
  explanation: z.string().min(1),
});

export type PredictionExplanationResponse = z.infer<typeof predictionExplanationResponseSchema>;
