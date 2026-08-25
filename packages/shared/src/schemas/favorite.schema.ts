import { z } from 'zod';
import { FAVORITE_TYPES } from '@tacynt/config';

export const createFavoriteSchema = z.object({
  type: z.enum(FAVORITE_TYPES),
  refId: z.string().min(1),
});
export type CreateFavoriteInput = z.infer<typeof createFavoriteSchema>;
