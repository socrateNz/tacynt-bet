import type { HydratedDocument } from 'mongoose';
import type { RiskLevel } from '@tacynt/config';
import type { DashboardAnalysisSummary, DashboardStats } from '@tacynt/shared';

import {
  AIAnalysis,
  Coupon,
  Prediction,
  PredictionResult,
  SavedCoupon,
  type IAIAnalysis,
  type ICompetition,
  type IMatch,
  type ITeam,
} from '../models';
import { orUndefined } from '../utils/mongoose';

type PopulatedMatchRef = Omit<HydratedDocument<IMatch>, 'competitionId' | 'homeTeamId' | 'awayTeamId'> & {
  competitionId: HydratedDocument<ICompetition>;
  homeTeamId: HydratedDocument<ITeam>;
  awayTeamId: HydratedDocument<ITeam>;
};

type PopulatedAnalysis = Omit<HydratedDocument<IAIAnalysis>, 'matchId'> & {
  matchId: PopulatedMatchRef;
};

export const dashboardService = {
  async getStats(userId: string): Promise<DashboardStats> {
    const [analysesCount, couponsGeneratedCount, couponsSavedCount, analyses] = await Promise.all([
      AIAnalysis.countDocuments({ requestedBy: userId }),
      Coupon.countDocuments({ userId }),
      SavedCoupon.countDocuments({ userId }),
      AIAnalysis.find({ requestedBy: userId }, '_id'),
    ]);

    const predictions = await Prediction.find(
      { aiAnalysisId: { $in: analyses.map((analysis) => analysis._id) } },
      '_id',
    );
    const results = await PredictionResult.find({
      predictionId: { $in: predictions.map((prediction) => prediction._id) },
      outcome: { $ne: 'PENDING' },
    });

    const wonPredictionsCount = results.filter((result) => result.outcome === 'WON').length;
    const settledPredictionsCount = results.length;

    return {
      analysesCount,
      couponsGeneratedCount,
      couponsSavedCount,
      settledPredictionsCount,
      wonPredictionsCount,
      successRate:
        settledPredictionsCount > 0 ? Math.round((wonPredictionsCount / settledPredictionsCount) * 100) : null,
    };
  },

  async getRecentAnalyses(userId: string, limit = 5): Promise<DashboardAnalysisSummary[]> {
    const analyses = (await AIAnalysis.find({ requestedBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: 'matchId',
        populate: [{ path: 'competitionId' }, { path: 'homeTeamId' }, { path: 'awayTeamId' }],
      })) as unknown as PopulatedAnalysis[];

    return analyses.map((analysis) => ({
      id: analysis.id,
      matchId: analysis.matchId.id,
      match: {
        homeTeam: {
          id: analysis.matchId.homeTeamId.id,
          name: analysis.matchId.homeTeamId.name,
          shortName: orUndefined(analysis.matchId.homeTeamId.shortName),
          slug: analysis.matchId.homeTeamId.slug,
          logo: orUndefined(analysis.matchId.homeTeamId.logo),
        },
        awayTeam: {
          id: analysis.matchId.awayTeamId.id,
          name: analysis.matchId.awayTeamId.name,
          shortName: orUndefined(analysis.matchId.awayTeamId.shortName),
          slug: analysis.matchId.awayTeamId.slug,
          logo: orUndefined(analysis.matchId.awayTeamId.logo),
        },
        competition: {
          id: analysis.matchId.competitionId.id,
          name: analysis.matchId.competitionId.name,
          slug: analysis.matchId.competitionId.slug,
          country: orUndefined(analysis.matchId.competitionId.country),
          logo: orUndefined(analysis.matchId.competitionId.logo),
        },
        kickoffAt: analysis.matchId.kickoffAt.toISOString(),
      },
      summary: analysis.summary,
      confidence: analysis.confidence,
      risk: analysis.risk as RiskLevel,
      createdAt: analysis.createdAt.toISOString(),
    }));
  },
};
