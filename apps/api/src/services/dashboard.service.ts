import type { DashboardAnalysisSummary, DashboardStats } from '@tacynt/shared';

import { AIAnalysis, Coupon, Prediction, PredictionResult, SavedCoupon } from '../models';
import {
  ANALYSIS_MATCH_POPULATE,
  ANALYSIS_SUMMARY_PROJECTION,
  mapAnalysisToSummary,
  type PopulatedAnalysis,
} from './analysis-summary.util';

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
      .select(ANALYSIS_SUMMARY_PROJECTION)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate(ANALYSIS_MATCH_POPULATE)) as unknown as PopulatedAnalysis[];

    return analyses.map(mapAnalysisToSummary);
  },
};
