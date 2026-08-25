'use client';

import { useQuery } from '@tanstack/react-query';

import { dashboardService } from '@/services/dashboard-service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.stats,
  });
}

export function useRecentAnalyses() {
  return useQuery({
    queryKey: ['dashboard', 'recent-analyses'],
    queryFn: dashboardService.recentAnalyses,
  });
}
