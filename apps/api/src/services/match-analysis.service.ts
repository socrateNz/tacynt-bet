import type { HydratedDocument } from 'mongoose';
import { AI_DAILY_LIMITS, type MarketType, type RiskLevel } from '@tacynt/config';
import type { AIAnalysisResult } from '@tacynt/shared';

import { AIAnalysis, Prediction, UsageLog, User, type IAIAnalysis } from '../models';
import { AppError } from '../utils/errors';
import { matchService } from './match.service';
import { aiService, MATCH_ANALYSIS_PROMPT_VERSION } from './ai';

/** Une analyse recente est reutilisee plutot que de rappeler Gemini (section "performance"). */
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

/** Tarification approximative (USD / million de tokens) - a ajuster selon la grille reelle. */
const PRICE_PER_MILLION_TOKENS = { input: 0.1, output: 0.4 };

function estimateCost(tokensInput: number, tokensOutput: number): number {
  return (
    (tokensInput / 1_000_000) * PRICE_PER_MILLION_TOKENS.input +
    (tokensOutput / 1_000_000) * PRICE_PER_MILLION_TOKENS.output
  );
}

async function toDTO(analysis: HydratedDocument<IAIAnalysis>, cached: boolean): Promise<AIAnalysisResult> {
  const predictions = await Prediction.find({ aiAnalysisId: analysis._id }).sort({ confidence: -1 });

  return {
    id: analysis.id,
    matchId: analysis.matchId.toString(),
    promptVersion: analysis.promptVersion,
    summary: analysis.summary,
    favorableFactors: analysis.favorableFactors,
    riskFactors: analysis.riskFactors,
    confidence: analysis.confidence,
    risk: analysis.risk as RiskLevel,
    predictions: predictions.map((prediction) => ({
      id: prediction.id,
      market: prediction.market as MarketType,
      selection: prediction.selection,
      odds: prediction.odds,
      confidence: prediction.confidence,
      risk: prediction.risk as RiskLevel,
      reason: prediction.reason,
    })),
    createdAt: analysis.createdAt.toISOString(),
    cached,
  };
}

async function assertWithinDailyLimit(userId: string): Promise<void> {
  const user = await User.findById(userId);
  if (!user) {
    throw AppError.unauthorized();
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const usedToday = await UsageLog.countDocuments({
    userId,
    operation: 'MATCH_ANALYSIS',
    createdAt: { $gte: startOfDay },
  });

  const limit = AI_DAILY_LIMITS[user.plan];
  if (usedToday >= limit) {
    throw AppError.aiLimitReached(
      `Limite quotidienne de ${limit} analyses IA atteinte pour votre plan (${user.plan}).`,
    );
  }
}

export const matchAnalysisService = {
  async analyzeMatch(matchId: string, userId: string): Promise<AIAnalysisResult> {
    const cached = await AIAnalysis.findOne({
      matchId,
      promptVersion: MATCH_ANALYSIS_PROMPT_VERSION,
      createdAt: { $gte: new Date(Date.now() - CACHE_TTL_MS) },
    }).sort({ createdAt: -1 });

    if (cached) {
      return toDTO(cached, true);
    }

    await assertWithinDailyLimit(userId);

    const match = await matchService.getMatchById(matchId, userId);
    const result = await aiService.analyzeMatch(match);

    const analysis = await AIAnalysis.create({
      matchId,
      requestedBy: userId,
      promptVersion: result.promptVersion,
      model: result.usage.model,
      summary: result.summary,
      favorableFactors: result.favorableFactors,
      riskFactors: result.riskFactors,
      confidence: result.confidence,
      risk: result.risk,
      rawResponse: result,
    });

    await Prediction.insertMany(
      result.predictions.map((prediction) => ({
        matchId,
        aiAnalysisId: analysis._id,
        market: prediction.market,
        selection: prediction.selection,
        odds: prediction.odds,
        confidence: prediction.confidence,
        risk: prediction.risk,
        reason: prediction.reason,
      })),
    );

    await UsageLog.create({
      userId,
      model: result.usage.model,
      operation: 'MATCH_ANALYSIS',
      tokensInput: result.usage.tokensInput,
      tokensOutput: result.usage.tokensOutput,
      estimatedCost: estimateCost(result.usage.tokensInput, result.usage.tokensOutput),
    });

    return toDTO(analysis, false);
  },

  async getAnalysisById(id: string): Promise<AIAnalysisResult> {
    const analysis = await AIAnalysis.findById(id);
    if (!analysis) {
      throw AppError.notFound('Analyse introuvable.');
    }
    return toDTO(analysis, true);
  },
};
