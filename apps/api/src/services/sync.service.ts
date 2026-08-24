import type { Types } from 'mongoose';

import { Sport, Competition, Team, Match, Odds } from '../models';
import { sportsDataService } from './sports-data';
import type { ProviderTeamRef } from './sports-data';
import { logger } from '../config/logger';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Tire les donnees du SportsDataService (mock pour l'instant) et les upsert dans MongoDB.
 * L'API /api/matches lit ensuite uniquement la base, jamais le provider directement
 * (voir section "IA et donnees sportives" du cahier des charges).
 */
export async function syncMatchesFromProvider(): Promise<{ matches: number; odds: number }> {
  const providerMatches = await sportsDataService.getMatches();

  const sportCache = new Map<string, Types.ObjectId>();
  const competitionCache = new Map<string, Types.ObjectId>();
  const teamCache = new Map<string, Types.ObjectId>();

  let matchCount = 0;
  let oddsCount = 0;

  for (const providerMatch of providerMatches) {
    let sportId = sportCache.get(providerMatch.sport.externalId);
    if (!sportId) {
      const slug = slugify(providerMatch.sport.name);
      const sport = await Sport.findOneAndUpdate(
        { slug },
        { name: providerMatch.sport.name, slug },
        { upsert: true, returnDocument: 'after' },
      );
      sportId = sport._id;
      sportCache.set(providerMatch.sport.externalId, sportId);
    }

    let competitionId = competitionCache.get(providerMatch.competition.externalId);
    if (!competitionId) {
      const slug = slugify(providerMatch.competition.name);
      const competition = await Competition.findOneAndUpdate(
        { sportId, slug },
        {
          name: providerMatch.competition.name,
          slug,
          sportId,
          country: providerMatch.competition.country,
          logo: providerMatch.competition.logo,
          externalId: providerMatch.competition.externalId,
        },
        { upsert: true, returnDocument: 'after' },
      );
      competitionId = competition._id;
      competitionCache.set(providerMatch.competition.externalId, competitionId);
    }

    const resolveTeam = async (teamRef: ProviderTeamRef): Promise<Types.ObjectId> => {
      const cached = teamCache.get(teamRef.externalId);
      if (cached) return cached;

      const slug = slugify(teamRef.name);
      const team = await Team.findOneAndUpdate(
        { sportId, slug },
        {
          name: teamRef.name,
          shortName: teamRef.shortName,
          slug,
          sportId,
          country: teamRef.country,
          logo: teamRef.logo,
          externalId: teamRef.externalId,
        },
        { upsert: true, returnDocument: 'after' },
      );
      teamCache.set(teamRef.externalId, team._id);
      return team._id;
    };

    const homeTeamId = await resolveTeam(providerMatch.homeTeam);
    const awayTeamId = await resolveTeam(providerMatch.awayTeam);

    const match = await Match.findOneAndUpdate(
      { externalId: providerMatch.externalId },
      {
        sportId,
        competitionId,
        homeTeamId,
        awayTeamId,
        kickoffAt: new Date(providerMatch.kickoffAt),
        status: providerMatch.status,
        venue: providerMatch.venue,
        externalId: providerMatch.externalId,
        homeStats: providerMatch.homeStats,
        awayStats: providerMatch.awayStats,
        headToHead: providerMatch.headToHead,
        absences: providerMatch.absences,
        finalScore: providerMatch.finalScore,
      },
      { upsert: true, returnDocument: 'after' },
    );
    matchCount += 1;

    const providerOdds = await sportsDataService.getOdds(providerMatch.externalId);
    for (const odd of providerOdds) {
      await Odds.findOneAndUpdate(
        { matchId: match._id, market: odd.market, selection: odd.selection },
        { matchId: match._id, market: odd.market, selection: odd.selection, value: odd.value },
        { upsert: true },
      );
      oddsCount += 1;
    }
  }

  logger.info(`Synchronisation terminee : ${matchCount} matchs, ${oddsCount} cotes.`);
  return { matches: matchCount, odds: oddsCount };
}
