'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateFavoriteInput } from '@tacynt/shared';

import { ApiRequestError } from '@/services/api-client';
import { favoriteService } from '@/services/favorite-service';

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiRequestError ? error.message : fallback;
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFavoriteInput) => favoriteService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
    onError: (error) => {
      toast.error(errorMessage(error, "Impossible d'ajouter ce favori."));
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => favoriteService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Impossible de retirer ce favori.'));
    },
  });
}
