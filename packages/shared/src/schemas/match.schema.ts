import { z } from 'zod';
import { MATCH_STATUSES } from '@tacynt/config';

export const matchQuerySchema = z.object({
  sport: z.string().trim().min(1).optional(),
  competition: z.string().trim().min(1).optional(),
  date: z.iso.date().optional(),
  status: z.enum(MATCH_STATUSES).optional(),
  favoritesOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
export type MatchQueryInput = z.infer<typeof matchQuerySchema>;
