import type { HydratedDocument } from 'mongoose';
import type { DashboardAnalysisSummary, HistoryStats, PaginatedResult, PerformanceBreakdown } from '@tacynt/shared';

import { AIAnalysis, Prediction, PredictionResult, type IMatch, type IPrediction, type ISport } from '../models';
import { ANALYSIS_MATCH_POPULATE, mapAnalysisToSummary, type PopulatedAnalysis } from './analysis-summary.util';
import { predictionResultService } from './prediction-result.service';

type PopulatedPredictionWithSport = Omit<HydratedDocument<IPrediction>, 'matchId'> & {
  matchId: HydratedDocument<IMatch> & { sportId: HydratedDocument<ISport> };
};

interface BreakdownEntry {
  key: string;
  label: string;
  outcome: string;
}

function buildBreakdown(entries: BreakdownEntry[]): PerformanceBreakdown[] {
  const buckets = new Map<string, { label: string; total: number; won: number; lost: number }>();

  for (const entry of entries) {
    const bucket = buckets.get(entry.key) ?? { label: entry.label, total: 0, won: 0, lost: 0 };
    bucket.total += 1;
    if (entry.outcome === 'WON') bucket.won += 1;
    if (entry.outcome === 'LOST') bucket.lost += 1;
    buckets.set(entry.key, bucket);
  }

  return Array.from(buckets.entries())
    .map(([key, bucket]) => ({
      key,
      label: bucket.label,
      total: bucket.total,
      won: bucket.won,
      lost: bucket.lost,
      successRate: bucket.won + bucket.lost > 0 ? Math.round((bucket.won / (bucket.won + bucket.lost)) * 100) : null,
    }))
    .sort((a, b) => b.total - a.total);
}

export const historyService = {
  async listAnalyses(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<DashboardAnalysisSummary>> {
    const query = { requestedBy: userId };

    const [analyses, total] = await Promise.all([
      AIAnalysis.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(ANALYSIS_MATCH_POPULATE) as unknown as Promise<PopulatedAnalysis[]>,
      AIAnalysis.countDocuments(query),
    ]);

    return { items: analyses.map(mapAnalysisToSummary), total, page, limit };
  },

  async getStats(userId: string): Promise<HistoryStats> {
    // Regle les matchs termines avant de calculer les stats, pour rester a jour sans cron dedie.
    await predictionResultService.settlePendingResults();

    const analyses = await AIAnalysis.find({ requestedBy: userId }, '_id');
    const analysisIds = analyses.map((analysis) => analysis._id);

    const predictions = (await Prediction.find({ aiAnalysisId: { $in: analysisIds } }).populate({
      path: 'matchId',
      populate: [{ path: 'sportId' }],
    })) as unknown as PopulatedPredictionWithSport[];

    const results = await PredictionResult.find({
      predictionId: { $in: predictions.map((prediction) => prediction._id) },
    });
    const outcomeByPredictionId = new Map(results.map((result) => [result.predictionId.toString(), result.outcome]));

    let wonPredictions = 0;
    let lostPredictions = 0;
    let voidPredictions = 0;
    let pendingPredictions = 0;

    const sportEntries: BreakdownEntry[] = [];
    const marketEntries: BreakdownEntry[] = [];
    const riskEntries: BreakdownEntry[] = [];

    for (const prediction of predictions) {
      const outcome = outcomeByPredictionId.get(prediction.id) ?? 'PENDING';

      if (outcome === 'WON') wonPredictions += 1;
      else if (outcome === 'LOST') lostPredictions += 1;
      else if (outcome === 'VOID') voidPredictions += 1;
      else pendingPredictions += 1;

      const sport = prediction.matchId.sportId;
      sportEntries.push({ key: sport.slug, label: sport.name, outcome });
      marketEntries.push({ key: prediction.market, label: prediction.market, outcome });
      riskEntries.push({ key: prediction.risk, label: prediction.risk, outcome });
    }

    const settledPredictions = wonPredictions + lostPredictions;

    return {
      totalPredictions: predictions.length,
      settledPredictions,
      wonPredictions,
      lostPredictions,
      voidPredictions,
      pendingPredictions,
      successRate: settledPredictions > 0 ? Math.round((wonPredictions / settledPredictions) * 100) : null,
      performanceBySport: buildBreakdown(sportEntries),
      performanceByMarket: buildBreakdown(marketEntries),
      performanceByRisk: buildBreakdown(riskEntries),
    };
  },
};
