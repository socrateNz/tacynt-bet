import type { MarketType, RiskLevel, RiskProfile } from '@tacynt/config';
import type { PredictionListItem } from '@tacynt/shared';

export interface GeneratorSelection {
  predictionId: string;
  matchId: string;
  market: MarketType;
  selection: string;
  odds: number;
  confidence: number;
  risk: RiskLevel;
  reason: string;
}

export interface GeneratedCoupon {
  selections: GeneratorSelection[];
  actualOdds: number;
  differenceFromTarget: number;
  averageConfidence: number;
  risk: RiskLevel;
}

interface RiskProfileRules {
  minConfidence: number;
  maxIndividualOdds: number;
  excludedMarkets: MarketType[];
}

/**
 * Section 14 : PRUDENT privilegie une confiance elevee et des cotes individuelles
 * raisonnables ; EQUILIBRE assouplit ces bornes ; AUDACIEUX les leve quasiment.
 */
const RISK_PROFILE_RULES: Record<RiskProfile, RiskProfileRules> = {
  PRUDENT: { minConfidence: 60, maxIndividualOdds: 2.5, excludedMarkets: ['CORRECT_SCORE', 'HANDICAP'] },
  EQUILIBRE: { minConfidence: 40, maxIndividualOdds: 5, excludedMarkets: [] },
  AUDACIEUX: { minConfidence: 0, maxIndividualOdds: 1000, excludedMarkets: [] },
};

const MIN_SELECTIONS = 2;
const MAX_SELECTIONS = 6;
const SAMPLE_ATTEMPTS = 4000;
/** Deux coupons partageant >= 60% de leurs selections sont consideres "trop similaires". */
const SIMILARITY_THRESHOLD = 0.6;

const RISK_SEVERITY: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, VERY_HIGH: 3 };
const RISK_BY_SEVERITY: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'];

function computeAggregateRisk(selections: GeneratorSelection[]): RiskLevel {
  const maxSeverity = Math.max(...selections.map((selection) => RISK_SEVERITY[selection.risk]));
  // Chaque selection supplementaire doit aussi se realiser : plus de jambes = plus de risque cumule.
  const countPenalty = selections.length >= 5 ? 1 : 0;
  const severity = Math.min(RISK_BY_SEVERITY.length - 1, maxSeverity + countPenalty);
  return RISK_BY_SEVERITY[severity] as RiskLevel;
}

function shuffle<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j] as T, array[i] as T];
  }
  return array;
}

/** Etape 1 de la section 13 : filtrer les pronostics incompatibles avec le profil de risque. */
export function filterPoolForRiskProfile(
  pool: PredictionListItem[],
  riskProfile: RiskProfile,
): GeneratorSelection[] {
  const rules = RISK_PROFILE_RULES[riskProfile];

  return pool
    .filter(
      (prediction) =>
        prediction.confidence >= rules.minConfidence &&
        prediction.odds <= rules.maxIndividualOdds &&
        !rules.excludedMarkets.includes(prediction.market),
    )
    .map((prediction) => ({
      predictionId: prediction.id,
      matchId: prediction.matchId,
      market: prediction.market,
      selection: prediction.selection,
      odds: prediction.odds,
      confidence: prediction.confidence,
      risk: prediction.risk,
      reason: prediction.reason,
    }));
}

/**
 * Etapes 2-8 de la section 13 : genere par echantillonnage aleatoire un grand nombre de
 * combinaisons (au plus une selection par match, pour eviter les marches correles d'un meme
 * match), calcule leur cote exacte, ecarte celles trop eloignees de la cible, puis retient
 * les `numberOfCoupons` meilleures tout en excluant les combinaisons trop similaires entre elles.
 */
export function generateCoupons(
  candidates: GeneratorSelection[],
  options: { targetOdds: number; numberOfCoupons: number; tolerance?: number },
): GeneratedCoupon[] {
  const { targetOdds, numberOfCoupons } = options;
  const tolerance = options.tolerance ?? Math.max(1, targetOdds * 0.3);

  const byMatch = new Map<string, GeneratorSelection[]>();
  for (const candidate of candidates) {
    const list = byMatch.get(candidate.matchId) ?? [];
    list.push(candidate);
    byMatch.set(candidate.matchId, list);
  }

  const matchIds = Array.from(byMatch.keys());
  const maxSize = Math.min(MAX_SELECTIONS, matchIds.length);
  if (maxSize < MIN_SELECTIONS) {
    return [];
  }

  const seenSignatures = new Set<string>();
  const scored: GeneratedCoupon[] = [];

  for (let attempt = 0; attempt < SAMPLE_ATTEMPTS; attempt += 1) {
    const size = MIN_SELECTIONS + Math.floor(Math.random() * (maxSize - MIN_SELECTIONS + 1));
    const pickedMatchIds = shuffle(matchIds).slice(0, size);

    const selections = pickedMatchIds.map((matchId) => {
      const options = byMatch.get(matchId) as GeneratorSelection[];
      return options[Math.floor(Math.random() * options.length)] as GeneratorSelection;
    });

    const signature = selections
      .map((selection) => selection.predictionId)
      .sort()
      .join('|');
    if (seenSignatures.has(signature)) continue;
    seenSignatures.add(signature);

    const actualOdds = selections.reduce((acc, selection) => acc * selection.odds, 1);
    const differenceFromTarget = Math.abs(actualOdds - targetOdds);
    if (differenceFromTarget > tolerance) continue;

    const averageConfidence =
      selections.reduce((acc, selection) => acc + selection.confidence, 0) / selections.length;

    scored.push({
      selections,
      actualOdds: Math.round(actualOdds * 100) / 100,
      differenceFromTarget: Math.round(differenceFromTarget * 100) / 100,
      averageConfidence: Math.round(averageConfidence),
      risk: computeAggregateRisk(selections),
    });
  }

  scored.sort((a, b) => a.differenceFromTarget - b.differenceFromTarget);

  const diverse: GeneratedCoupon[] = [];
  for (const candidate of scored) {
    if (diverse.length >= numberOfCoupons) break;

    const candidateIds = new Set(candidate.selections.map((selection) => selection.predictionId));
    const tooSimilar = diverse.some((existing) => {
      const existingIds = new Set(existing.selections.map((selection) => selection.predictionId));
      const overlap = [...candidateIds].filter((id) => existingIds.has(id)).length;
      return overlap / Math.min(candidateIds.size, existingIds.size) >= SIMILARITY_THRESHOLD;
    });

    if (!tooSimilar) {
      diverse.push(candidate);
    }
  }

  return diverse;
}
