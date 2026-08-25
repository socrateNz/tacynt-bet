import { z } from 'zod';
import { USER_ROLES } from '@tacynt/config';

export const adminUsersQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
export type AdminUsersQueryInput = z.infer<typeof adminUsersQuerySchema>;

export const updateUserRoleSchema = z.object({
  role: z.enum(USER_ROLES),
});
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
