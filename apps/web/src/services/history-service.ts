import type { DashboardAnalysisSummary, HistoryStats, PaginatedResult } from '@tacynt/shared';

import { toQueryString } from '@/lib/query-string';

import { apiClient } from './api-client';

export const historyService = {
  stats: () => apiClient.get<HistoryStats>('/history/stats'),
  analyses: (page: number, limit: number) =>
    apiClient.get<PaginatedResult<DashboardAnalysisSummary>>(
      `/history/analyses${toQueryString({ page, limit })}`,
    ),
};
