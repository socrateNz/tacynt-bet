import type { AiOperation, UserPlan, UserRole } from '@tacynt/config';

export interface AdminOverviewStats {
  totalUsers: number;
  totalMatches: number;
  totalAnalyses: number;
  totalCoupons: number;
  totalAiCost: number;
  usersByRole: { role: UserRole; count: number }[];
  usersByPlan: { plan: UserPlan; count: number }[];
}

export interface AdminUserSummary {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: UserPlan;
  isActive: boolean;
  createdAt: string;
}

export interface AiUsageByOperation {
  operation: AiOperation;
  count: number;
  tokensInput: number;
  tokensOutput: number;
  cost: number;
}

export interface AiUsageByDay {
  date: string;
  cost: number;
  count: number;
}

export interface AiUsageStats {
  totalTokensInput: number;
  totalTokensOutput: number;
  totalCost: number;
  totalCalls: number;
  byOperation: AiUsageByOperation[];
  byDay: AiUsageByDay[];
}

export interface AdminAnalyticsStats {
  couponsByDay: { date: string; count: number }[];
  signupsByDay: { date: string; count: number }[];
  globalSuccessRate: number | null;
  globalSettledPredictions: number;
}
