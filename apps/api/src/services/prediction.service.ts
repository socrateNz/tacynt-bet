import type { HydratedDocument, QueryFilter } from 'mongoose';
import type { MarketType, RiskLevel } from '@tacynt/config';
import type { PaginatedResult, PredictionListItem, PredictionQueryInput } from '@tacynt/shared';

import {
  Match,
  Prediction,
  type ICompetition,
  type IMatch,
  type IPrediction,
  type ITeam,
} from '../models';
import { AppError } from '../utils/errors';
import { orUndefined } from '../utils/mongoose';

type PopulatedMatchRef = Omit<HydratedDocument<IMatch>, 'competitionId' | 'homeTeamId' | 'awayTeamId'> & {
  competitionId: HydratedDocument<ICompetition>;
  homeTeamId: HydratedDocument<ITeam>;
  awayTeamId: HydratedDocument<ITeam>;
};

type PopulatedPrediction = Omit<HydratedDocument<IPrediction>, 'matchId'> & {
  matchId: PopulatedMatchRef;
};

const MATCH_POPULATE = {
  path: 'matchId',
  populate: [{ path: 'competitionId' }, { path: 'homeTeamId' }, { path: 'awayTeamId' }],
};

function toDTO(prediction: PopulatedPrediction): PredictionListItem {
  const match = prediction.matchId;

  return {
    id: prediction.id,
    matchId: match.id,
    match: {
      homeTeam: {
        id: match.homeTeamId.id,
        name: match.homeTeamId.name,
        shortName: orUndefined(match.homeTeamId.shortName),
        slug: match.homeTeamId.slug,
        logo: orUndefined(match.homeTeamId.logo),
      },
      awayTeam: {
        id: match.awayTeamId.id,
        name: match.awayTeamId.name,
        shortName: orUndefined(match.awayTeamId.shortName),
        slug: match.awayTeamId.slug,
        logo: orUndefined(match.awayTeamId.logo),
      },
      competition: {
        id: match.competitionId.id,
        name: match.competitionId.name,
        slug: match.competitionId.slug,
        country: orUndefined(match.competitionId.country),
        logo: orUndefined(match.competitionId.logo),
      },
      kickoffAt: match.kickoffAt.toISOString(),
      status: match.status,
    },
    market: prediction.market as MarketType,
    selection: prediction.selection,
    odds: prediction.odds,
    confidence: prediction.confidence,
    risk: prediction.risk as RiskLevel,
    reason: prediction.reason,
    createdAt: prediction.createdAt.toISOString(),
  };
}

export const predictionService = {
  async list(filters: PredictionQueryInput): Promise<PaginatedResult<PredictionListItem>> {
    const query: QueryFilter<IPrediction> = {};

    if (filters.matchId) {
      query.matchId = filters.matchId;
    } else if (filters.upcomingOnly) {
      const upcoming = await Match.find({ status: 'SCHEDULED' }, '_id');
      query.matchId = { $in: upcoming.map((match) => match._id) };
    }

    if (filters.market) {
      query.market = filters.market;
    }
    if (filters.risk) {
      query.risk = filters.risk;
    }
    if (filters.minConfidence !== undefined) {
      query.confidence = { $gte: filters.minConfidence };
    }

    const [predictions, total] = await Promise.all([
      Prediction.find(query)
        .sort({ createdAt: -1 })
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit)
        .populate(MATCH_POPULATE) as unknown as Promise<PopulatedPrediction[]>,
      Prediction.countDocuments(query),
    ]);

    return {
      items: predictions.map(toDTO),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  },

  async getById(id: string): Promise<PredictionListItem> {
    const prediction = (await Prediction.findById(id).populate(
      MATCH_POPULATE,
    )) as unknown as PopulatedPrediction | null;

    if (!prediction) {
      throw AppError.notFound('Pronostic introuvable.');
    }

    return toDTO(prediction);
  },

  /**
   * Pool de pronostics eligibles pour la generation de coupons (Phase 11) : uniquement des
   * matchs pas encore joues. Ne deduplique pas par match - c'est au CouponService de decider
   * comment combiner/eviter les marches correles d'un meme match.
   */
  async getAvailablePool(options: { minConfidence?: number; risk?: RiskLevel } = {}): Promise<
    PredictionListItem[]
  > {
    const upcoming = await Match.find({ status: 'SCHEDULED' }, '_id');
    const query: QueryFilter<IPrediction> = { matchId: { $in: upcoming.map((match) => match._id) } };

    if (options.risk) {
      query.risk = options.risk;
    }
    if (options.minConfidence !== undefined) {
      query.confidence = { $gte: options.minConfidence };
    }

    const predictions = (await Prediction.find(query)
      .sort({ confidence: -1 })
      .populate(MATCH_POPULATE)) as unknown as PopulatedPrediction[];

    return predictions.map(toDTO);
  },
};
