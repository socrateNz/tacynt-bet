import type { MatchDetail, MatchListItem, MatchQueryInput, PaginatedResult } from '@tacynt/shared';

import { toQueryString } from '@/lib/query-string';

import { apiClient } from './api-client';

export const matchService = {
  list: (filters: Partial<MatchQueryInput>) =>
    apiClient.get<PaginatedResult<MatchListItem>>(`/matches${toQueryString(filters)}`),
  detail: (id: string) => apiClient.get<MatchDetail>(`/matches/${id}`),
};
