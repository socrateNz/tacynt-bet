'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CouponQueryInput, GenerateCouponsInput } from '@tacynt/shared';

import { ApiRequestError } from '@/services/api-client';
import { couponService } from '@/services/coupon-service';

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiRequestError ? error.message : fallback;
}

export function useGenerateCoupons() {
  return useMutation({
    mutationFn: (input: GenerateCouponsInput) => couponService.generate(input),
  });
}

export function useCoupons(filters: Partial<CouponQueryInput>) {
  return useQuery({
    queryKey: ['coupons', filters],
    queryFn: () => couponService.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCoupon(id: string) {
  return useQuery({
    queryKey: ['coupons', id],
    queryFn: () => couponService.detail(id),
    enabled: Boolean(id),
  });
}

export function useSaveCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponService.save(id),
    onSuccess: (coupon) => {
      queryClient.setQueryData(['coupons', coupon.id], coupon);
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon sauvegarde.');
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Impossible de sauvegarder ce coupon.'));
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Impossible de supprimer ce coupon.'));
    },
  });
}
