import type { MarketType, RiskLevel } from '@tacynt/config';

export interface AIAnalysisPrediction {
  id: string;
  market: MarketType;
  selection: string;
  odds: number;
  confidence: number;
  risk: RiskLevel;
  reason: string;
}

export interface AIAnalysisResult {
  id: string;
  matchId: string;
  promptVersion: string;
  summary: string;
  favorableFactors: string[];
  riskFactors: string[];
  confidence: number;
  risk: RiskLevel;
  predictions: AIAnalysisPrediction[];
  createdAt: string;
  /** Vrai si cette analyse a ete reutilisee depuis le cache plutot que regeneree. */
  cached: boolean;
}
