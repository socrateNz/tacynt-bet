import type { MarketType, MatchStatus } from '@tacynt/config';

export interface ProviderSportRef {
  externalId: string;
  name: string;
}

export interface ProviderCompetitionRef {
  externalId: string;
  name: string;
  country?: string;
  logo?: string;
}

export interface ProviderTeamRef {
  externalId: string;
  name: string;
  shortName?: string;
  country?: string;
  logo?: string;
}

export interface ProviderTeamStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  form: string[];
  overRate: number;
  bttsRate: number;
}

export interface ProviderHeadToHead {
  playedAt: string;
  competition?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export interface ProviderAbsence {
  player: string;
  side: 'HOME' | 'AWAY';
  type: 'INJURY' | 'SUSPENSION' | 'OTHER';
  detail?: string;
}

export interface ProviderMatch {
  externalId: string;
  sport: ProviderSportRef;
  competition: ProviderCompetitionRef;
  homeTeam: ProviderTeamRef;
  awayTeam: ProviderTeamRef;
  kickoffAt: string;
  status: MatchStatus;
  venue?: string;
  homeStats: ProviderTeamStats;
  awayStats: ProviderTeamStats;
  headToHead: ProviderHeadToHead[];
  absences: ProviderAbsence[];
  finalScore?: { home: number; away: number };
}

export interface ProviderOdds {
  matchExternalId: string;
  market: MarketType;
  selection: string;
  value: number;
}

export interface ProviderStanding {
  team: ProviderTeamRef;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  position: number;
}

/**
 * Abstraction de la source de donnees sportives. Un fournisseur reel (API-Football,
 * Sportmonks, ...) implementera cette meme interface pour remplacer MockSportsDataProvider
 * sans toucher au reste du backend.
 */
export interface SportsDataProvider {
  getMatches(params?: { competitionExternalId?: string }): Promise<ProviderMatch[]>;
  getMatch(externalId: string): Promise<ProviderMatch | null>;
  getTeams(params?: { competitionExternalId?: string }): Promise<ProviderTeamRef[]>;
  getStandings(competitionExternalId: string): Promise<ProviderStanding[]>;
  getOdds(matchExternalId: string): Promise<ProviderOdds[]>;
  getTeamStats(teamExternalId: string): Promise<ProviderTeamStats>;
}
