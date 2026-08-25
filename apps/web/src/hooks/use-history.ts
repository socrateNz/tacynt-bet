'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { historyService } from '@/services/history-service';

export function useHistoryStats() {
  return useQuery({
    queryKey: ['history', 'stats'],
    queryFn: historyService.stats,
  });
}

export function useHistoryAnalyses(page: number, limit: number) {
  return useQuery({
    queryKey: ['history', 'analyses', page, limit],
    queryFn: () => historyService.analyses(page, limit),
    placeholderData: keepPreviousData,
  });
}
