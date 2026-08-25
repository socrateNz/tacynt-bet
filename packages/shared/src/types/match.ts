import type { MarketType, MatchStatus } from '@tacynt/config';

export interface SportRef {
  id: string;
  name: string;
  slug: string;
}

export interface CompetitionRef {
  id: string;
  name: string;
  slug: string;
  country?: string;
  logo?: string;
}

export interface TeamRef {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  logo?: string;
}

export interface OddsSelection {
  selection: string;
  value: number;
}

export interface MarketOdds {
  market: MarketType;
  selections: OddsSelection[];
}

export interface TeamMatchStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  /** Resultats recents, du plus recent au plus ancien. */
  form: string[];
  overRate?: number;
  bttsRate?: number;
}

export interface HeadToHeadEntry {
  playedAt: string;
  competition?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export interface Absence {
  player: string;
  side: 'HOME' | 'AWAY';
  type: 'INJURY' | 'SUSPENSION' | 'OTHER';
  detail?: string;
}

export interface MatchListItem {
  id: string;
  sport: SportRef;
  competition: CompetitionRef;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  kickoffAt: string;
  status: MatchStatus;
  venue?: string;
  mainOdds?: MarketOdds;
  isFavorite: boolean;
  /** Id du document Favorite (present uniquement si isFavorite est vrai), pour DELETE /api/favorites/:id. */
  favoriteId?: string;
}

export interface MatchDetail extends MatchListItem {
  homeStats: TeamMatchStats;
  awayStats: TeamMatchStats;
  headToHead: HeadToHeadEntry[];
  absences: Absence[];
  finalScore?: { home: number; away: number };
  odds: MarketOdds[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
