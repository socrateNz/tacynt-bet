import { z } from 'zod';

export const historyAnalysesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});
export type HistoryAnalysesQueryInput = z.infer<typeof historyAnalysesQuerySchema>;
