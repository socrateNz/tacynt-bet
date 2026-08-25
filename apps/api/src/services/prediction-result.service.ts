import type { PredictionOutcome } from '@tacynt/config';

import { Match, Prediction, PredictionResult } from '../models';

interface FinalScore {
  home: number;
  away: number;
}

/**
 * Determine l'issue d'une selection a partir du score final reel du match.
 * Ne devine jamais : si le marche n'est pas structure de maniere evaluable
 * (HANDICAP, CORRECT_SCORE - non generes par le mock provider actuel), retourne VOID
 * plutot que d'inventer une regle.
 */
export function evaluateSelection(market: string, selection: string, score: FinalScore): PredictionOutcome {
  const { home, away } = score;

  switch (market) {
    case 'MATCH_WINNER': {
      const winner = home > away ? 'HOME' : away > home ? 'AWAY' : 'DRAW';
      return selection === winner ? 'WON' : 'LOST';
    }
    case 'DOUBLE_CHANCE': {
      if (selection === 'HOME_OR_DRAW') return home >= away ? 'WON' : 'LOST';
      if (selection === 'DRAW_OR_AWAY') return away >= home ? 'WON' : 'LOST';
      if (selection === 'HOME_OR_AWAY') return home !== away ? 'WON' : 'LOST';
      return 'VOID';
    }
    case 'DRAW_NO_BET': {
      if (home === away) return 'VOID';
      const winner = home > away ? 'HOME' : 'AWAY';
      return selection === winner ? 'WON' : 'LOST';
    }
    case 'OVER_UNDER': {
      const totalGoals = home + away;
      if (selection === 'OVER_2_5') return totalGoals > 2.5 ? 'WON' : 'LOST';
      if (selection === 'UNDER_2_5') return totalGoals < 2.5 ? 'WON' : 'LOST';
      return 'VOID';
    }
    case 'BTTS': {
      const bothScored = home > 0 && away > 0;
      if (selection === 'YES') return bothScored ? 'WON' : 'LOST';
      if (selection === 'NO') return !bothScored ? 'WON' : 'LOST';
      return 'VOID';
    }
    default:
      return 'VOID';
  }
}

export const predictionResultService = {
  evaluateSelection,

  /**
   * Regle les pronostics des matchs termines : cree ou met a jour le PredictionResult
   * correspondant. Idempotent - ne retouche jamais un resultat deja regle (WON/LOST/VOID).
   */
  async settlePendingResults(): Promise<{ settled: number }> {
    const finishedMatches = await Match.find({ status: 'FINISHED' });
    let settled = 0;

    for (const match of finishedMatches) {
      const home = match.finalScore?.home;
      const away = match.finalScore?.away;
      if (home === null || home === undefined || away === null || away === undefined) {
        continue;
      }

      const predictions = await Prediction.find({ matchId: match._id });
      if (predictions.length === 0) continue;

      const existingResults = await PredictionResult.find({
        predictionId: { $in: predictions.map((prediction) => prediction._id) },
      });
      const existingByPredictionId = new Map(
        existingResults.map((result) => [result.predictionId.toString(), result]),
      );

      for (const prediction of predictions) {
        const existing = existingByPredictionId.get(prediction.id);
        if (existing && existing.outcome !== 'PENDING') continue;

        const outcome = evaluateSelection(prediction.market, prediction.selection, { home, away });

        await PredictionResult.findOneAndUpdate(
          { predictionId: prediction._id },
          { predictionId: prediction._id, matchId: match._id, outcome, settledAt: new Date() },
          { upsert: true },
        );
        settled += 1;
      }
    }

    return { settled };
  },
};
