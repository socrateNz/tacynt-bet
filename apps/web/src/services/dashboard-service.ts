import type { DashboardAnalysisSummary, DashboardStats } from '@tacynt/shared';

import { apiClient } from './api-client';

export const dashboardService = {
  stats: () => apiClient.get<DashboardStats>('/dashboard/stats'),
  recentAnalyses: () => apiClient.get<DashboardAnalysisSummary[]>('/dashboard/recent-analyses'),
};
