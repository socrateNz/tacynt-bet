import { z } from 'zod';
import { COUPON_STATUSES, RISK_PROFILES } from '@tacynt/config';

export const generateCouponsSchema = z.object({
  targetOdds: z.coerce.number().min(1.01, 'La cote cible doit etre superieure a 1.01').max(1000),
  numberOfCoupons: z.coerce.number().int().min(1).max(10).default(5),
  riskProfile: z.enum(RISK_PROFILES),
});
export type GenerateCouponsInput = z.infer<typeof generateCouponsSchema>;

export const couponQuerySchema = z.object({
  status: z.enum(COUPON_STATUSES).optional(),
  savedOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
export type CouponQueryInput = z.infer<typeof couponQuerySchema>;
