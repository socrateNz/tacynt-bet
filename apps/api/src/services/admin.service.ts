import type { HydratedDocument } from 'mongoose';
import type {
  AdminAnalyticsStats,
  AdminOverviewStats,
  AdminUserSummary,
  AiUsageByDay,
  AiUsageByOperation,
  AiUsageStats,
  PaginatedResult,
} from '@tacynt/shared';
import type { AiOperation, UserPlan, UserRole } from '@tacynt/config';
import { USER_PLANS, USER_ROLES } from '@tacynt/config';

import { AIAnalysis, Coupon, Match, PredictionResult, UsageLog, User, type IUser } from '../models';
import { predictionResultService } from './prediction-result.service';
import { syncMatchesFromProvider } from './sync.service';
import { AppError } from '../utils/errors';
import { escapeRegex } from '../utils/regex';

const USAGE_WINDOW_DAYS = 30;

function windowStart(): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - USAGE_WINDOW_DAYS);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function toUserSummary(user: HydratedDocument<IUser>): AdminUserSummary {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    plan: user.plan as UserPlan,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  };
}

async function assertNotSelf(requesterId: string, targetId: string) {
  if (requesterId === targetId) {
    throw AppError.forbidden('Vous ne pouvez pas modifier votre propre compte administrateur.');
  }
}

export const adminService = {
  async getOverview(): Promise<AdminOverviewStats> {
    const [totalUsers, totalMatches, totalAnalyses, totalCoupons, costAgg, roleCounts, planCounts] =
      await Promise.all([
        User.countDocuments(),
        Match.countDocuments(),
        AIAnalysis.countDocuments(),
        Coupon.countDocuments(),
        UsageLog.aggregate<{ _id: null; total: number }>([
          { $group: { _id: null, total: { $sum: '$estimatedCost' } } },
        ]),
        Promise.all(USER_ROLES.map((role) => User.countDocuments({ role }))),
        Promise.all(USER_PLANS.map((plan) => User.countDocuments({ plan }))),
      ]);

    return {
      totalUsers,
      totalMatches,
      totalAnalyses,
      totalCoupons,
      totalAiCost: costAgg[0]?.total ?? 0,
      usersByRole: USER_ROLES.map((role, index) => ({ role, count: roleCounts[index] ?? 0 })),
      usersByPlan: USER_PLANS.map((plan, index) => ({ plan, count: planCounts[index] ?? 0 })),
    };
  },

  async listUsers(search: string | undefined, page: number, limit: number): Promise<PaginatedResult<AdminUserSummary>> {
    const query = search
      ? { $or: [{ email: new RegExp(escapeRegex(search), 'i') }, { name: new RegExp(escapeRegex(search), 'i') }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return { items: users.map(toUserSummary), total, page, limit };
  },

  async updateUserRole(requesterId: string, targetId: string, role: UserRole): Promise<AdminUserSummary> {
    await assertNotSelf(requesterId, targetId);

    const user = await User.findByIdAndUpdate(targetId, { role }, { returnDocument: 'after' });
    if (!user) {
      throw AppError.notFound('Utilisateur introuvable.');
    }
    return toUserSummary(user);
  },

  async updateUserStatus(
    requesterId: string,
    requesterRole: UserRole,
    targetId: string,
    isActive: boolean,
  ): Promise<AdminUserSummary> {
    await assertNotSelf(requesterId, targetId);

    const target = await User.findById(targetId);
    if (!target) {
      throw AppError.notFound('Utilisateur introuvable.');
    }

    if (target.role !== 'USER' && requesterRole !== 'SUPER_ADMIN') {
      throw AppError.forbidden('Seul un super administrateur peut modifier un compte administrateur.');
    }

    target.isActive = isActive;
    await target.save();
    return toUserSummary(target);
  },

  async syncMatches(): Promise<{ matches: number; odds: number }> {
    return syncMatchesFromProvider();
  },

  async getAiUsage(): Promise<AiUsageStats> {
    const [totals, byOperation, byDay] = await Promise.all([
      UsageLog.aggregate<{ _id: null; tokensInput: number; tokensOutput: number; cost: number; count: number }>([
        {
          $group: {
            _id: null,
            tokensInput: { $sum: '$tokensInput' },
            tokensOutput: { $sum: '$tokensOutput' },
            cost: { $sum: '$estimatedCost' },
            count: { $sum: 1 },
          },
        },
      ]),
      UsageLog.aggregate<{ _id: AiOperation; tokensInput: number; tokensOutput: number; cost: number; count: number }>(
        [
          {
            $group: {
              _id: '$operation',
              tokensInput: { $sum: '$tokensInput' },
              tokensOutput: { $sum: '$tokensOutput' },
              cost: { $sum: '$estimatedCost' },
              count: { $sum: 1 },
            },
          },
        ],
      ),
      UsageLog.aggregate<{ _id: string; cost: number; count: number }>([
        { $match: { createdAt: { $gte: windowStart() } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            cost: { $sum: '$estimatedCost' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const byOperationResult: AiUsageByOperation[] = byOperation.map((entry) => ({
      operation: entry._id,
      count: entry.count,
      tokensInput: entry.tokensInput,
      tokensOutput: entry.tokensOutput,
      cost: entry.cost,
    }));

    const byDayResult: AiUsageByDay[] = byDay.map((entry) => ({
      date: entry._id,
      cost: entry.cost,
      count: entry.count,
    }));

    return {
      totalTokensInput: totals[0]?.tokensInput ?? 0,
      totalTokensOutput: totals[0]?.tokensOutput ?? 0,
      totalCost: totals[0]?.cost ?? 0,
      totalCalls: totals[0]?.count ?? 0,
      byOperation: byOperationResult,
      byDay: byDayResult,
    };
  },

  async getAnalytics(): Promise<AdminAnalyticsStats> {
    await predictionResultService.settlePendingResults();

    const [couponsByDay, signupsByDay, wonCount, lostCount] = await Promise.all([
      Coupon.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: windowStart() } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: windowStart() } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      PredictionResult.countDocuments({ outcome: 'WON' }),
      PredictionResult.countDocuments({ outcome: 'LOST' }),
    ]);

    const settled = wonCount + lostCount;

    return {
      couponsByDay: couponsByDay.map((entry) => ({ date: entry._id, count: entry.count })),
      signupsByDay: signupsByDay.map((entry) => ({ date: entry._id, count: entry.count })),
      globalSuccessRate: settled > 0 ? Math.round((wonCount / settled) * 100) : null,
      globalSettledPredictions: settled,
    };
  },
};
