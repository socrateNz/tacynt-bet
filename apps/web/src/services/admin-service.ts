import type {
  AdminAnalyticsStats,
  AdminOverviewStats,
  AdminUserSummary,
  AdminUsersQueryInput,
  AiUsageStats,
  PaginatedResult,
} from '@tacynt/shared';
import type { UserRole } from '@tacynt/config';

import { toQueryString } from '@/lib/query-string';

import { apiClient } from './api-client';

export const adminService = {
  overview: () => apiClient.get<AdminOverviewStats>('/admin/overview'),
  listUsers: (filters: Partial<AdminUsersQueryInput>) =>
    apiClient.get<PaginatedResult<AdminUserSummary>>(`/admin/users${toQueryString(filters)}`),
  updateUserRole: (id: string, role: UserRole) =>
    apiClient.patch<AdminUserSummary>(`/admin/users/${id}/role`, { role }),
  updateUserStatus: (id: string, isActive: boolean) =>
    apiClient.patch<AdminUserSummary>(`/admin/users/${id}/status`, { isActive }),
  syncMatches: () => apiClient.post<{ matches: number; odds: number }>('/admin/matches/sync'),
  aiUsage: () => apiClient.get<AiUsageStats>('/admin/ai-usage'),
  analytics: () => apiClient.get<AdminAnalyticsStats>('/admin/analytics'),
};
