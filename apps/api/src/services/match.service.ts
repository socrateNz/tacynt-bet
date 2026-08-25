import type { HydratedDocument, QueryFilter } from 'mongoose';
import type { MarketType, MatchStatus } from '@tacynt/config';
import type { MatchDetail, MatchListItem, MarketOdds, MatchQueryInput, PaginatedResult } from '@tacynt/shared';

import {
  Favorite,
  Match,
  Odds,
  Sport,
  Competition,
  type ICompetition,
  type IMatch,
  type IOdds,
  type ISport,
  type ITeam,
} from '../models';
import { AppError } from '../utils/errors';
import { orUndefined } from '../utils/mongoose';

/** Forme reelle d'un document Match une fois les refs peuplees (sportId, competitionId, ...). */
type PopulatedMatch = Omit<
  HydratedDocument<IMatch>,
  'sportId' | 'competitionId' | 'homeTeamId' | 'awayTeamId'
> & {
  sportId: HydratedDocument<ISport>;
  competitionId: HydratedDocument<ICompetition>;
  homeTeamId: HydratedDocument<ITeam>;
  awayTeamId: HydratedDocument<ITeam>;
};

function toMarketOdds(odds: HydratedDocument<IOdds>[]): MarketOdds[] {
  const byMarket = new Map<MarketType, { selection: string; value: number }[]>();

  for (const odd of odds) {
    const market = odd.market as MarketType;
    const list = byMarket.get(market) ?? [];
    list.push({ selection: odd.selection, value: odd.value });
    byMarket.set(market, list);
  }

  return Array.from(byMarket.entries()).map(([market, selections]) => ({ market, selections }));
}

function toMatchListItem(
  match: PopulatedMatch,
  odds: HydratedDocument<IOdds>[],
  favoriteId: string | undefined,
): MatchListItem {
  const marketOdds = toMarketOdds(odds);

  return {
    id: match.id,
    sport: { id: match.sportId.id, name: match.sportId.name, slug: match.sportId.slug },
    competition: {
      id: match.competitionId.id,
      name: match.competitionId.name,
      slug: match.competitionId.slug,
      country: orUndefined(match.competitionId.country),
      logo: orUndefined(match.competitionId.logo),
    },
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
    kickoffAt: match.kickoffAt.toISOString(),
    status: match.status as MatchStatus,
    venue: orUndefined(match.venue),
    mainOdds: marketOdds.find((entry) => entry.market === 'MATCH_WINNER'),
    isFavorite: Boolean(favoriteId),
    favoriteId,
  };
}

function toMatchDetail(
  match: PopulatedMatch,
  odds: HydratedDocument<IOdds>[],
  favoriteId: string | undefined,
): MatchDetail {
  const home = match.homeStats;
  const away = match.awayStats;

  return {
    ...toMatchListItem(match, odds, favoriteId),
    homeStats: {
      played: home?.played ?? 0,
      wins: home?.wins ?? 0,
      draws: home?.draws ?? 0,
      losses: home?.losses ?? 0,
      goalsFor: home?.goalsFor ?? 0,
      goalsAgainst: home?.goalsAgainst ?? 0,
      cleanSheets: home?.cleanSheets ?? 0,
      form: home?.form ?? [],
      overRate: home?.overRate ?? undefined,
      bttsRate: home?.bttsRate ?? undefined,
    },
    awayStats: {
      played: away?.played ?? 0,
      wins: away?.wins ?? 0,
      draws: away?.draws ?? 0,
      losses: away?.losses ?? 0,
      goalsFor: away?.goalsFor ?? 0,
      goalsAgainst: away?.goalsAgainst ?? 0,
      cleanSheets: away?.cleanSheets ?? 0,
      form: away?.form ?? [],
      overRate: away?.overRate ?? undefined,
      bttsRate: away?.bttsRate ?? undefined,
    },
    headToHead: (match.headToHead ?? []).map((entry) => ({
      playedAt: entry.playedAt.toISOString(),
      competition: orUndefined(entry.competition),
      homeTeam: entry.homeTeam,
      awayTeam: entry.awayTeam,
      homeScore: entry.homeScore,
      awayScore: entry.awayScore,
    })),
    absences: (match.absences ?? []).map((absence) => ({
      player: absence.player,
      side: absence.side as 'HOME' | 'AWAY',
      type: (absence.type ?? 'OTHER') as 'INJURY' | 'SUSPENSION' | 'OTHER',
      detail: orUndefined(absence.detail),
    })),
    finalScore:
      match.finalScore?.home !== undefined &&
      match.finalScore?.home !== null &&
      match.finalScore?.away !== undefined &&
      match.finalScore?.away !== null
        ? { home: match.finalScore.home, away: match.finalScore.away }
        : undefined,
    odds: toMarketOdds(odds),
  };
}

export const matchService = {
  async listMatches(filters: MatchQueryInput & { userId?: string }): Promise<PaginatedResult<MatchListItem>> {
    const query: QueryFilter<IMatch> = {};
    const empty = { items: [], total: 0, page: filters.page, limit: filters.limit };

    if (filters.sport) {
      const sport = await Sport.findOne({ slug: filters.sport });
      if (!sport) return empty;
      query.sportId = sport._id;
    }

    if (filters.competition) {
      const competition = await Competition.findOne({ slug: filters.competition });
      if (!competition) return empty;
      query.competitionId = competition._id;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.date) {
      query.kickoffAt = {
        $gte: new Date(`${filters.date}T00:00:00.000Z`),
        $lte: new Date(`${filters.date}T23:59:59.999Z`),
      };
    }

    if (filters.favoritesOnly) {
      if (!filters.userId) return empty;
      const favorites = await Favorite.find({ userId: filters.userId, type: 'MATCH' });
      query._id = { $in: favorites.map((favorite) => favorite.refId) };
    }

    const [matches, total] = await Promise.all([
      Match.find(query)
        .sort({ kickoffAt: 1 })
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit)
        .populate('sportId')
        .populate('competitionId')
        .populate('homeTeamId')
        .populate('awayTeamId') as unknown as Promise<PopulatedMatch[]>,
      Match.countDocuments(query),
    ]);

    const matchIds = matches.map((match) => match._id);
    const [odds, favorites] = await Promise.all([
      Odds.find({ matchId: { $in: matchIds } }),
      filters.userId
        ? Favorite.find({ userId: filters.userId, type: 'MATCH', refId: { $in: matchIds } })
        : Promise.resolve([]),
    ]);

    const favoriteByMatchId = new Map(favorites.map((favorite) => [favorite.refId.toString(), favorite.id]));

    const items = matches.map((match) =>
      toMatchListItem(
        match,
        odds.filter((odd) => odd.matchId.toString() === match.id),
        favoriteByMatchId.get(match.id),
      ),
    );

    return { items, total, page: filters.page, limit: filters.limit };
  },

  async getMatchById(id: string, userId?: string): Promise<MatchDetail> {
    const match = (await Match.findById(id)
      .populate('sportId')
      .populate('competitionId')
      .populate('homeTeamId')
      .populate('awayTeamId')) as unknown as PopulatedMatch | null;

    if (!match) {
      throw AppError.notFound('Match introuvable.');
    }

    const [odds, favorite] = await Promise.all([
      Odds.find({ matchId: match._id }),
      userId ? Favorite.findOne({ userId, type: 'MATCH', refId: match._id }) : Promise.resolve(null),
    ]);

    return toMatchDetail(match, odds, favorite?.id);
  },
};
