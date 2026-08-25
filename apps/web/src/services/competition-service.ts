import type { CompetitionOption } from '@tacynt/shared';

import { apiClient } from './api-client';

export const competitionService = {
  list: () => apiClient.get<CompetitionOption[]>('/competitions', { withAuth: false }),
};
