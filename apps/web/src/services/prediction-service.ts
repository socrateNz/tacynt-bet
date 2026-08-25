import type { PaginatedResult, PredictionListItem, PredictionQueryInput } from '@tacynt/shared';

import { toQueryString } from '@/lib/query-string';

import { apiClient } from './api-client';

export const predictionService = {
  list: (filters: Partial<PredictionQueryInput>) =>
    apiClient.get<PaginatedResult<PredictionListItem>>(`/predictions${toQueryString(filters)}`, {
      withAuth: false,
    }),
};
