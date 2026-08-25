'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { MatchQueryInput } from '@tacynt/shared';

import { matchService } from '@/services/match-service';

export function useMatches(filters: Partial<MatchQueryInput>) {
  return useQuery({
    queryKey: ['matches', filters],
    queryFn: () => matchService.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: ['matches', id],
    queryFn: () => matchService.detail(id),
    enabled: Boolean(id),
  });
}
