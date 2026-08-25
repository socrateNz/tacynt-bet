import type { Coupon, CouponQueryInput, GenerateCouponsInput, PaginatedResult } from '@tacynt/shared';

import { toQueryString } from '@/lib/query-string';

import { apiClient } from './api-client';

export const couponService = {
  generate: (input: GenerateCouponsInput) => apiClient.post<Coupon[]>('/coupons/generate', input),
  list: (filters: Partial<CouponQueryInput>) =>
    apiClient.get<PaginatedResult<Coupon>>(`/coupons${toQueryString(filters)}`),
  detail: (id: string) => apiClient.get<Coupon>(`/coupons/${id}`),
  save: (id: string) => apiClient.post<Coupon>(`/coupons/${id}/save`),
  remove: (id: string) => apiClient.delete<null>(`/coupons/${id}`),
};
