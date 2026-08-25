import type { RiskLevel } from '@tacynt/config';
import type { CompetitionRef, TeamRef } from './match';

export interface DashboardStats {
  analysesCount: number;
  couponsGeneratedCount: number;
  couponsSavedCount: number;
  settledPredictionsCount: number;
  wonPredictionsCount: number;
  /** null tant qu'aucun pronostic n'a ete regle (voir Phase Historique). */
  successRate: number | null;
}

export interface DashboardAnalysisSummary {
  id: string;
  matchId: string;
  match: {
    homeTeam: TeamRef;
    awayTeam: TeamRef;
    competition: CompetitionRef;
    kickoffAt: string;
  };
  summary: string;
  confidence: number;
  risk: RiskLevel;
  createdAt: string;
}
