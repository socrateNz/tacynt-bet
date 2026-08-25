'use client';

import { useQuery } from '@tanstack/react-query';

import { competitionService } from '@/services/competition-service';

export function useCompetitions() {
  return useQuery({
    queryKey: ['competitions'],
    queryFn: competitionService.list,
    staleTime: 5 * 60 * 1000,
  });
}
