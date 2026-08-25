'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AdminUsersQueryInput } from '@tacynt/shared';
import type { UserRole } from '@tacynt/config';

import { ApiRequestError } from '@/services/api-client';
import { adminService } from '@/services/admin-service';

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiRequestError ? error.message : fallback;
}

export function useAdminOverview() {
  return useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: adminService.overview,
  });
}

export function useAdminUsers(filters: Partial<AdminUsersQueryInput>) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminService.listUsers(filters),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => adminService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Role mis a jour.');
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Impossible de modifier le role.'));
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Statut mis a jour.');
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Impossible de modifier le statut.'));
    },
  });
}

export function useSyncMatches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.syncMatches,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
      toast.success(`Synchronisation terminee : ${result.matches} matchs, ${result.odds} cotes.`);
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Echec de la synchronisation.'));
    },
  });
}

export function useAdminAiUsage() {
  return useQuery({
    queryKey: ['admin', 'ai-usage'],
    queryFn: adminService.aiUsage,
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: adminService.analytics,
  });
}
