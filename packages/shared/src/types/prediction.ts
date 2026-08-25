import type { MarketType, MatchStatus, RiskLevel } from '@tacynt/config';
import type { CompetitionRef, TeamRef } from './match';

export interface PredictionListItem {
  id: string;
  matchId: string;
  match: {
    homeTeam: TeamRef;
    awayTeam: TeamRef;
    competition: CompetitionRef;
    kickoffAt: string;
    status: MatchStatus;
  };
  market: MarketType;
  selection: string;
  odds: number;
  confidence: number;
  risk: RiskLevel;
  reason: string;
  createdAt: string;
}
