import { ALL_MATCHES, ALL_ODDS, TEAMS_BY_COMPETITION, buildTeamStatsFor } from './fixtures';
import type {
  ProviderMatch,
  ProviderOdds,
  ProviderStanding,
  ProviderTeamRef,
  ProviderTeamStats,
  SportsDataProvider,
} from './types';

/**
 * Fournisseur mock : donnees generees en memoire (deterministes), pour le developpement
 * initial. Un fournisseur reel implementera la meme interface SportsDataProvider.
 */
export class MockSportsDataProvider implements SportsDataProvider {
  async getMatches(params?: { competitionExternalId?: string }): Promise<ProviderMatch[]> {
    if (params?.competitionExternalId) {
      return ALL_MATCHES.filter((match) => match.competition.externalId === params.competitionExternalId);
    }
    return ALL_MATCHES;
  }

  async getMatch(externalId: string): Promise<ProviderMatch | null> {
    return ALL_MATCHES.find((match) => match.externalId === externalId) ?? null;
  }

  async getTeams(params?: { competitionExternalId?: string }): Promise<ProviderTeamRef[]> {
    if (params?.competitionExternalId) {
      return TEAMS_BY_COMPETITION[params.competitionExternalId] ?? [];
    }
    return Object.values(TEAMS_BY_COMPETITION).flat();
  }

  async getStandings(competitionExternalId: string): Promise<ProviderStanding[]> {
    const teams = TEAMS_BY_COMPETITION[competitionExternalId] ?? [];

    const standings = teams.map((team) => {
      const stats = buildTeamStatsFor(team.externalId);
      return {
        team,
        played: stats.played,
        wins: stats.wins,
        draws: stats.draws,
        losses: stats.losses,
        goalsFor: stats.goalsFor,
        goalsAgainst: stats.goalsAgainst,
        points: stats.wins * 3 + stats.draws,
        position: 0,
      };
    });

    standings.sort((a, b) => b.points - a.points);
    return standings.map((standing, index) => ({ ...standing, position: index + 1 }));
  }

  async getOdds(matchExternalId: string): Promise<ProviderOdds[]> {
    return ALL_ODDS.filter((odd) => odd.matchExternalId === matchExternalId);
  }

  async getTeamStats(teamExternalId: string): Promise<ProviderTeamStats> {
    return buildTeamStatsFor(teamExternalId);
  }
}
