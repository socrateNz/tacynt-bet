import { describe, expect, it } from 'vitest';

import { filterPoolForRiskProfile, generateCoupons, type GeneratorSelection } from './coupon-generator';
import type { PredictionListItem } from '@tacynt/shared';

function makePrediction(overrides: Partial<PredictionListItem> & { matchId: string }): PredictionListItem {
  return {
    id: `pred-${overrides.matchId}-${overrides.market ?? 'MATCH_WINNER'}-${overrides.selection ?? 'HOME'}`,
    matchId: overrides.matchId,
    match: {
      homeTeam: { id: 'h', name: 'Home', slug: 'home' },
      awayTeam: { id: 'a', name: 'Away', slug: 'away' },
      competition: { id: 'c', name: 'Comp', slug: 'comp' },
      kickoffAt: new Date().toISOString(),
      status: 'SCHEDULED',
    },
    market: overrides.market ?? 'MATCH_WINNER',
    selection: overrides.selection ?? 'HOME',
    odds: overrides.odds ?? 2,
    confidence: overrides.confidence ?? 70,
    risk: overrides.risk ?? 'MEDIUM',
    reason: overrides.reason ?? 'test',
    createdAt: new Date().toISOString(),
  };
}

describe('filterPoolForRiskProfile', () => {
  const pool: PredictionListItem[] = [
    makePrediction({ matchId: 'm1', confidence: 70, odds: 1.8, risk: 'LOW' }),
    makePrediction({ matchId: 'm2', confidence: 45, odds: 4.5, risk: 'HIGH' }),
    makePrediction({ matchId: 'm3', confidence: 90, odds: 1.2, market: 'CORRECT_SCORE', risk: 'LOW' }),
    makePrediction({ matchId: 'm4', confidence: 10, odds: 8, risk: 'VERY_HIGH' }),
  ];

  it('PRUDENT excludes low-confidence, high-odds, and excluded markets', () => {
    const eligible = filterPoolForRiskProfile(pool, 'PRUDENT');
    const matchIds = eligible.map((s) => s.matchId);
    expect(matchIds).toContain('m1');
    expect(matchIds).not.toContain('m2'); // odds 4.5 > maxIndividualOdds 2.5
    expect(matchIds).not.toContain('m3'); // CORRECT_SCORE excluded
    expect(matchIds).not.toContain('m4'); // confidence 10 < minConfidence 60
  });

  it('EQUILIBRE is more permissive than PRUDENT but still bounded', () => {
    const eligible = filterPoolForRiskProfile(pool, 'EQUILIBRE');
    const matchIds = eligible.map((s) => s.matchId);
    expect(matchIds).toContain('m1');
    expect(matchIds).toContain('m2');
    expect(matchIds).toContain('m3');
    expect(matchIds).not.toContain('m4'); // confidence 10 < minConfidence 40
  });

  it('AUDACIEUX accepts everything regardless of confidence/odds/market', () => {
    const eligible = filterPoolForRiskProfile(pool, 'AUDACIEUX');
    expect(eligible).toHaveLength(pool.length);
  });
});

function makeSelection(matchId: string, odds: number, confidence = 70, risk: GeneratorSelection['risk'] = 'MEDIUM'): GeneratorSelection {
  return {
    predictionId: `pred-${matchId}`,
    matchId,
    market: 'MATCH_WINNER',
    selection: 'HOME',
    odds,
    confidence,
    risk,
    reason: 'test',
  };
}

describe('generateCoupons', () => {
  it('returns an empty array when fewer than 2 distinct matches are available', () => {
    const candidates = [makeSelection('m1', 2)];
    const result = generateCoupons(candidates, { targetOdds: 2, numberOfCoupons: 3 });
    expect(result).toEqual([]);
  });

  it('finds combinations whose actual odds are within tolerance of the target', () => {
    const candidates = [
      makeSelection('m1', 1.5),
      makeSelection('m2', 2),
      makeSelection('m3', 1.8),
      makeSelection('m4', 2.2),
      makeSelection('m5', 1.6),
    ];
    const targetOdds = 3;
    const result = generateCoupons(candidates, { targetOdds, numberOfCoupons: 3 });

    expect(result.length).toBeGreaterThan(0);
    for (const coupon of result) {
      expect(coupon.differenceFromTarget).toBeLessThanOrEqual(Math.max(1, targetOdds * 0.3) + 0.01);
      expect(coupon.actualOdds).toBeCloseTo(
        coupon.selections.reduce((acc, s) => acc * s.odds, 1),
        1,
      );
      // Never two selections from the same match (correlated markets).
      const matchIds = coupon.selections.map((s) => s.matchId);
      expect(new Set(matchIds).size).toBe(matchIds.length);
    }
  });

  it('never returns more coupons than requested', () => {
    const candidates = Array.from({ length: 6 }, (_, i) => makeSelection(`m${i}`, 1.5 + i * 0.1));
    const result = generateCoupons(candidates, { targetOdds: 2, numberOfCoupons: 2 });
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it('excludes combinations that are too similar to an already-selected coupon', () => {
    const candidates = [
      makeSelection('m1', 1.5),
      makeSelection('m2', 1.5),
      makeSelection('m3', 1.5),
    ];
    const result = generateCoupons(candidates, { targetOdds: 2.25, numberOfCoupons: 5, tolerance: 5 });

    for (let i = 0; i < result.length; i += 1) {
      for (let j = i + 1; j < result.length; j += 1) {
        const idsA = new Set(result[i]!.selections.map((s) => s.predictionId));
        const idsB = new Set(result[j]!.selections.map((s) => s.predictionId));
        const overlap = [...idsA].filter((id) => idsB.has(id)).length;
        const ratio = overlap / Math.min(idsA.size, idsB.size);
        expect(ratio).toBeLessThan(0.6);
      }
    }
  });

  it('escalates aggregate risk when a coupon has 5+ selections', () => {
    const candidates = Array.from({ length: 6 }, (_, i) => makeSelection(`m${i}`, 1.15, 70, 'LOW'));
    const result = generateCoupons(candidates, { targetOdds: 2.3, numberOfCoupons: 5, tolerance: 5 });
    const sixLeg = result.find((c) => c.selections.length >= 5);
    if (sixLeg) {
      // All-LOW selections with 5+ legs must escalate past LOW.
      expect(sixLeg.risk).not.toBe('LOW');
    }
  });
});
