import { randomUUID } from 'node:crypto';
import type { HydratedDocument, QueryFilter } from 'mongoose';
import type { MarketType } from '@tacynt/config';
import type {
  Coupon as CouponDTO,
  CouponQueryInput,
  GenerateCouponsInput,
  PaginatedResult,
} from '@tacynt/shared';

import {
  Coupon,
  CouponSelection,
  SavedCoupon,
  type ICompetition,
  type ICoupon,
  type ICouponSelection,
  type IMatch,
  type ITeam,
} from '../models';
import { AppError } from '../utils/errors';
import { orUndefined } from '../utils/mongoose';
import { predictionService } from './prediction.service';
import { filterPoolForRiskProfile, generateCoupons } from './coupon/coupon-generator';

type PopulatedMatchRef = Omit<HydratedDocument<IMatch>, 'competitionId' | 'homeTeamId' | 'awayTeamId'> & {
  competitionId: HydratedDocument<ICompetition>;
  homeTeamId: HydratedDocument<ITeam>;
  awayTeamId: HydratedDocument<ITeam>;
};

type PopulatedSelection = Omit<HydratedDocument<ICouponSelection>, 'matchId'> & {
  matchId: PopulatedMatchRef;
};

const SELECTION_MATCH_POPULATE = {
  path: 'matchId',
  populate: [{ path: 'competitionId' }, { path: 'homeTeamId' }, { path: 'awayTeamId' }],
};

/** Assemble un CouponDTO a partir de donnees deja chargees - ne fait jamais de requete elle-meme. */
function mapCouponToDTO(
  coupon: HydratedDocument<ICoupon>,
  selections: PopulatedSelection[],
  savedCouponId: string | undefined,
): CouponDTO {
  return {
    id: coupon.id,
    targetOdds: coupon.targetOdds,
    actualOdds: coupon.actualOdds,
    differenceFromTarget: coupon.differenceFromTarget,
    riskProfile: coupon.riskProfile,
    risk: coupon.risk,
    averageConfidence: coupon.averageConfidence,
    status: coupon.status,
    generationBatchId: coupon.generationBatchId,
    selections: selections.map((selection) => ({
      id: selection.id,
      matchId: selection.matchId.id,
      match: {
        homeTeam: {
          id: selection.matchId.homeTeamId.id,
          name: selection.matchId.homeTeamId.name,
          shortName: orUndefined(selection.matchId.homeTeamId.shortName),
          slug: selection.matchId.homeTeamId.slug,
          logo: orUndefined(selection.matchId.homeTeamId.logo),
        },
        awayTeam: {
          id: selection.matchId.awayTeamId.id,
          name: selection.matchId.awayTeamId.name,
          shortName: orUndefined(selection.matchId.awayTeamId.shortName),
          slug: selection.matchId.awayTeamId.slug,
          logo: orUndefined(selection.matchId.awayTeamId.logo),
        },
        competition: {
          id: selection.matchId.competitionId.id,
          name: selection.matchId.competitionId.name,
          slug: selection.matchId.competitionId.slug,
          country: orUndefined(selection.matchId.competitionId.country),
          logo: orUndefined(selection.matchId.competitionId.logo),
        },
        kickoffAt: selection.matchId.kickoffAt.toISOString(),
      },
      market: selection.market as MarketType,
      selection: selection.selection,
      odds: selection.odds,
      confidence: selection.confidence,
      reason: selection.reason,
    })),
    isSaved: Boolean(savedCouponId),
    savedCouponId,
    createdAt: coupon.createdAt.toISOString(),
  };
}

/** Cas d'un seul coupon (generation, detail, sauvegarde) - le cout de 2 requetes est negligeable ici. */
async function toDTO(coupon: HydratedDocument<ICoupon>, userId: string): Promise<CouponDTO> {
  const [selections, savedEntry] = await Promise.all([
    CouponSelection.find({ couponId: coupon._id }).populate(
      SELECTION_MATCH_POPULATE,
    ) as unknown as Promise<PopulatedSelection[]>,
    SavedCoupon.findOne({ userId, couponId: coupon._id }),
  ]);

  return mapCouponToDTO(coupon, selections, savedEntry?.id);
}

/**
 * Cas d'une liste paginee de coupons : au lieu de 2 requetes par coupon (N+1), on charge en une
 * seule fois toutes les selections et tous les statuts "sauvegarde" des coupons de la page.
 */
async function toDTOBatch(coupons: HydratedDocument<ICoupon>[], userId: string): Promise<CouponDTO[]> {
  const couponIds = coupons.map((coupon) => coupon._id);

  const [selections, savedEntries] = await Promise.all([
    CouponSelection.find({ couponId: { $in: couponIds } }).populate(
      SELECTION_MATCH_POPULATE,
    ) as unknown as Promise<PopulatedSelection[]>,
    SavedCoupon.find({ userId, couponId: { $in: couponIds } }),
  ]);

  const selectionsByCouponId = new Map<string, PopulatedSelection[]>();
  for (const selection of selections) {
    const key = selection.couponId.toString();
    const list = selectionsByCouponId.get(key) ?? [];
    list.push(selection);
    selectionsByCouponId.set(key, list);
  }

  const savedCouponIdByCouponId = new Map(savedEntries.map((entry) => [entry.couponId.toString(), entry.id]));

  return coupons.map((coupon) =>
    mapCouponToDTO(coupon, selectionsByCouponId.get(coupon.id) ?? [], savedCouponIdByCouponId.get(coupon.id)),
  );
}

export const couponService = {
  async generate(userId: string, input: GenerateCouponsInput): Promise<CouponDTO[]> {
    const pool = await predictionService.getAvailablePool();
    const eligible = filterPoolForRiskProfile(pool, input.riskProfile);

    const generated = generateCoupons(eligible, {
      targetOdds: input.targetOdds,
      numberOfCoupons: input.numberOfCoupons,
    });

    if (generated.length === 0) {
      throw AppError.validation(
        "Aucun coupon n'a pu etre genere avec les pronostics disponibles pour cette cote cible. Analysez davantage de matchs ou essayez une autre cote.",
      );
    }

    const generationBatchId = randomUUID();

    const createdCoupons = await Promise.all(
      generated.map(async (candidate) => {
        const coupon = await Coupon.create({
          userId,
          targetOdds: input.targetOdds,
          actualOdds: candidate.actualOdds,
          differenceFromTarget: candidate.differenceFromTarget,
          riskProfile: input.riskProfile,
          risk: candidate.risk,
          averageConfidence: candidate.averageConfidence,
          generationBatchId,
        });

        await CouponSelection.insertMany(
          candidate.selections.map((selection) => ({
            couponId: coupon._id,
            matchId: selection.matchId,
            predictionId: selection.predictionId,
            market: selection.market,
            selection: selection.selection,
            odds: selection.odds,
            confidence: selection.confidence,
            reason: selection.reason,
          })),
        );

        return coupon;
      }),
    );

    return Promise.all(createdCoupons.map((coupon) => toDTO(coupon, userId)));
  },

  async list(userId: string, filters: CouponQueryInput): Promise<PaginatedResult<CouponDTO>> {
    const query: QueryFilter<ICoupon> = { userId };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.savedOnly) {
      const saved = await SavedCoupon.find({ userId });
      query._id = { $in: saved.map((entry) => entry.couponId) };
    }

    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .sort({ createdAt: -1 })
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit),
      Coupon.countDocuments(query),
    ]);

    return {
      items: await toDTOBatch(coupons, userId),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  },

  async getById(userId: string, id: string): Promise<CouponDTO> {
    const coupon = await Coupon.findOne({ _id: id, userId });
    if (!coupon) {
      throw AppError.notFound('Coupon introuvable.');
    }
    return toDTO(coupon, userId);
  },

  async save(userId: string, id: string): Promise<CouponDTO> {
    const coupon = await Coupon.findOne({ _id: id, userId });
    if (!coupon) {
      throw AppError.notFound('Coupon introuvable.');
    }

    await SavedCoupon.findOneAndUpdate(
      { userId, couponId: coupon._id },
      { userId, couponId: coupon._id },
      { upsert: true },
    );

    return toDTO(coupon, userId);
  },

  async remove(userId: string, id: string): Promise<void> {
    const coupon = await Coupon.findOne({ _id: id, userId });
    if (!coupon) {
      throw AppError.notFound('Coupon introuvable.');
    }

    await Promise.all([
      CouponSelection.deleteMany({ couponId: coupon._id }),
      SavedCoupon.deleteMany({ couponId: coupon._id }),
      Coupon.deleteOne({ _id: coupon._id }),
    ]);
  },
};
