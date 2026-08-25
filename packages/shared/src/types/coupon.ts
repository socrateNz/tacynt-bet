import type { CouponStatus, MarketType, RiskLevel, RiskProfile } from '@tacynt/config';
import type { CompetitionRef, TeamRef } from './match';

export interface CouponSelectionItem {
  id: string;
  matchId: string;
  match: {
    homeTeam: TeamRef;
    awayTeam: TeamRef;
    competition: CompetitionRef;
    kickoffAt: string;
  };
  market: MarketType;
  selection: string;
  odds: number;
  confidence: number;
  reason: string;
}

export interface Coupon {
  id: string;
  targetOdds: number;
  actualOdds: number;
  differenceFromTarget: number;
  riskProfile: RiskProfile;
  risk: RiskLevel;
  averageConfidence: number;
  status: CouponStatus;
  generationBatchId: string;
  selections: CouponSelectionItem[];
  isSaved: boolean;
  savedCouponId?: string;
  createdAt: string;
}
