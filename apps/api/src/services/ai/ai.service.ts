import type { MatchDetail } from '@tacynt/shared';
import type { MarketType, RiskLevel } from '@tacynt/config';

import { logger } from '../../config/logger';
import { AppError } from '../../utils/errors';
import { generateJson } from './gemini-client';
import { buildMatchAnalysisPrompt, MATCH_ANALYSIS_PROMPT_VERSION } from './prompts/match-analysis.prompt';
import {
  buildPredictionExplanationPrompt,
  PREDICTION_EXPLANATION_PROMPT_VERSION,
  type PredictionExplanationInput,
} from './prompts/prediction-explanation.prompt';
import { matchAnalysisResponseSchema } from './schemas/match-analysis.schema';
import { predictionExplanationResponseSchema } from './schemas/prediction-explanation.schema';

export interface MatchAnalysisPrediction {
  market: MarketType;
  selection: string;
  /** Cote calculee/verifiee par le backend a partir de nos donnees - jamais celle de Gemini. */
  odds: number;
  confidence: number;
  risk: RiskLevel;
  reason: string;
}

export interface AiUsage {
  model: string;
  tokensInput: number;
  tokensOutput: number;
}

export interface MatchAnalysisResult {
  promptVersion: string;
  summary: string;
  favorableFactors: string[];
  riskFactors: string[];
  confidence: number;
  risk: RiskLevel;
  predictions: MatchAnalysisPrediction[];
  usage: AiUsage;
}

export interface PredictionExplanationResult {
  promptVersion: string;
  explanation: string;
  usage: AiUsage;
}

export const aiService = {
  /**
   * Analyse un match a partir des donnees deja en base (jamais de source externe appelee
   * directement par l'IA). Les pronostics retournes sont recoupes avec les cotes reellement
   * disponibles : tout pronostic sur un marche/selection absent est ecarte.
   */
  async analyzeMatch(match: MatchDetail): Promise<MatchAnalysisResult> {
    const { systemInstruction, prompt } = buildMatchAnalysisPrompt(match);

    const { data, usage } = await generateJson({
      systemInstruction,
      prompt,
      schema: matchAnalysisResponseSchema,
    });

    const predictions: MatchAnalysisPrediction[] = [];

    for (const prediction of data.predictions) {
      const marketOdds = match.odds.find((entry) => entry.market === prediction.market);
      const selectionOdds = marketOdds?.selections.find((entry) => entry.selection === prediction.selection);

      if (!selectionOdds) {
        logger.warn(
          { matchId: match.id, market: prediction.market, selection: prediction.selection },
          'Pronostic IA ignore : marche/selection absent des cotes disponibles',
        );
        continue;
      }

      predictions.push({
        market: prediction.market,
        selection: prediction.selection,
        odds: selectionOdds.value,
        confidence: prediction.confidence,
        risk: prediction.risk,
        reason: prediction.reason,
      });
    }

    if (predictions.length === 0) {
      throw AppError.aiService("L'IA n'a produit aucun pronostic exploitable pour ce match.");
    }

    return {
      promptVersion: MATCH_ANALYSIS_PROMPT_VERSION,
      summary: data.summary,
      favorableFactors: data.favorableFactors,
      riskFactors: data.riskFactors,
      confidence: data.confidence,
      risk: data.risk,
      predictions,
      usage,
    };
  },

  async explainPrediction(input: PredictionExplanationInput): Promise<PredictionExplanationResult> {
    const { systemInstruction, prompt } = buildPredictionExplanationPrompt(input);

    const { data, usage } = await generateJson({
      systemInstruction,
      prompt,
      schema: predictionExplanationResponseSchema,
    });

    return {
      promptVersion: PREDICTION_EXPLANATION_PROMPT_VERSION,
      explanation: data.explanation,
      usage,
    };
  },
};
