import type { MarketType } from '@tacynt/config';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AIAnalysis, Competition, Match, Prediction, PredictionResult, Sport, Team } from '../models';
import { predictionResultService } from '../services/prediction-result.service';
import { clearTestDb, startTestDb, stopTestDb } from './test-db';

beforeAll(async () => {
  await startTestDb();
}, 300000);

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await stopTestDb();
});

async function seedMatch(externalId: string, status: 'FINISHED' | 'SCHEDULED', finalScore?: { home: number; away: number }) {
  const sport = await Sport.create({ name: 'Football', slug: `football-${externalId}` });
  const competition = await Competition.create({ name: 'League', slug: `league-${externalId}`, sportId: sport._id });
  const home = await Team.create({ name: `Home ${externalId}`, slug: `home-${externalId}`, sportId: sport._id });
  const away = await Team.create({ name: `Away ${externalId}`, slug: `away-${externalId}`, sportId: sport._id });

  return Match.create({
    sportId: sport._id,
    competitionId: competition._id,
    homeTeamId: home._id,
    awayTeamId: away._id,
    kickoffAt: new Date(),
    status,
    finalScore,
  });
}

async function seedPrediction(matchId: string, market: MarketType, selection: string) {
  const analysis = await AIAnalysis.create({
    matchId,
    promptVersion: 'v1',
    model: 'test',
    summary: 'test',
    confidence: 70,
    risk: 'MEDIUM',
  });

  return Prediction.create({
    matchId,
    aiAnalysisId: analysis._id,
    market,
    selection,
    odds: 2,
    confidence: 70,
    risk: 'MEDIUM',
    reason: 'test',
  });
}

describe('settlePendingResults', () => {
  it('settles a MATCH_WINNER prediction as WON when the home team wins', async () => {
    const match = await seedMatch('m1', 'FINISHED', { home: 2, away: 0 });
    const prediction = await seedPrediction(match.id, 'MATCH_WINNER', 'HOME');

    const result = await predictionResultService.settlePendingResults();

    expect(result.settled).toBe(1);
    const record = await PredictionResult.findOne({ predictionId: prediction._id });
    expect(record?.outcome).toBe('WON');
    expect(record?.matchId.toString()).toBe(match.id);
  });

  it('never associates a result with the wrong match when settling several matches at once', async () => {
    const matchA = await seedMatch('a', 'FINISHED', { home: 3, away: 0 }); // HOME wins
    const matchB = await seedMatch('b', 'FINISHED', { home: 0, away: 3 }); // AWAY wins

    const predA = await seedPrediction(matchA.id, 'MATCH_WINNER', 'HOME');
    const predB = await seedPrediction(matchB.id, 'MATCH_WINNER', 'HOME'); // should LOSE - B's home team lost

    await predictionResultService.settlePendingResults();

    const resultA = await PredictionResult.findOne({ predictionId: predA._id });
    const resultB = await PredictionResult.findOne({ predictionId: predB._id });

    expect(resultA?.outcome).toBe('WON');
    expect(resultA?.matchId.toString()).toBe(matchA.id);
    expect(resultB?.outcome).toBe('LOST');
    expect(resultB?.matchId.toString()).toBe(matchB.id);
  });

  it('skips matches without a final score', async () => {
    const match = await seedMatch('no-score', 'FINISHED', undefined);
    await seedPrediction(match.id, 'MATCH_WINNER', 'HOME');

    const result = await predictionResultService.settlePendingResults();
    expect(result.settled).toBe(0);
  });

  it('skips matches that are not FINISHED', async () => {
    const match = await seedMatch('scheduled', 'SCHEDULED', { home: 1, away: 0 });
    await seedPrediction(match.id, 'MATCH_WINNER', 'HOME');

    const result = await predictionResultService.settlePendingResults();
    expect(result.settled).toBe(0);
  });

  it('is idempotent - a second call settles nothing new', async () => {
    const match = await seedMatch('idem', 'FINISHED', { home: 1, away: 1 });
    await seedPrediction(match.id, 'DOUBLE_CHANCE', 'HOME_OR_DRAW');

    const first = await predictionResultService.settlePendingResults();
    const second = await predictionResultService.settlePendingResults();

    expect(first.settled).toBe(1);
    expect(second.settled).toBe(0);

    const count = await PredictionResult.countDocuments();
    expect(count).toBe(1);
  });
});
