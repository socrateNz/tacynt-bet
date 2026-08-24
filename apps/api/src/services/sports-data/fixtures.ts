import type {
  ProviderAbsence,
  ProviderCompetitionRef,
  ProviderHeadToHead,
  ProviderMatch,
  ProviderOdds,
  ProviderSportRef,
  ProviderTeamRef,
  ProviderTeamStats,
} from './types';
import type { MatchStatus } from '@tacynt/config';

/** Petit generateur pseudo-aleatoire deterministe (Park-Miller), pour des donnees mock stables. */
function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

export const SPORT: ProviderSportRef = { externalId: 'football', name: 'Football' };

export const COMPETITIONS: ProviderCompetitionRef[] = [
  { externalId: 'ligue-1', name: 'Ligue 1', country: 'France' },
  { externalId: 'premier-league', name: 'Premier League', country: 'Angleterre' },
  { externalId: 'liga', name: 'Liga', country: 'Espagne' },
];

export const TEAMS_BY_COMPETITION: Record<string, ProviderTeamRef[]> = {
  'ligue-1': [
    { externalId: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', country: 'France' },
    { externalId: 'om', name: 'Olympique de Marseille', shortName: 'OM', country: 'France' },
    { externalId: 'ol', name: 'Olympique Lyonnais', shortName: 'OL', country: 'France' },
    { externalId: 'asm', name: 'AS Monaco', shortName: 'Monaco', country: 'France' },
  ],
  'premier-league': [
    { externalId: 'mci', name: 'Manchester City', shortName: 'Man City', country: 'Angleterre' },
    { externalId: 'liv', name: 'Liverpool', shortName: 'Liverpool', country: 'Angleterre' },
    { externalId: 'ars', name: 'Arsenal', shortName: 'Arsenal', country: 'Angleterre' },
    { externalId: 'che', name: 'Chelsea', shortName: 'Chelsea', country: 'Angleterre' },
  ],
  liga: [
    { externalId: 'rma', name: 'Real Madrid', shortName: 'Real Madrid', country: 'Espagne' },
    { externalId: 'fcb', name: 'FC Barcelone', shortName: 'Barcelone', country: 'Espagne' },
    { externalId: 'atm', name: 'Atletico Madrid', shortName: 'Atletico', country: 'Espagne' },
    { externalId: 'sev', name: 'Sevilla FC', shortName: 'Sevilla', country: 'Espagne' },
  ],
};

function buildTeamStats(teamExternalId: string): ProviderTeamStats {
  const rand = seededRandom(hashString(teamExternalId));
  const played = 10;
  const wins = 2 + Math.floor(rand() * 5);
  const remaining = played - wins;
  const losses = Math.floor(rand() * (remaining + 1));
  const draws = remaining - losses;
  const goalsFor = wins * 2 + draws + Math.floor(rand() * 6);
  const goalsAgainst = losses * 2 + draws + Math.floor(rand() * 5);
  const cleanSheets = Math.floor(rand() * 6);
  const formPool: string[] = ['W', 'D', 'L'];
  const form = Array.from({ length: 5 }, () => formPool[Math.floor(rand() * formPool.length)] as string);
  const overRate = Math.round(40 + rand() * 40);
  const bttsRate = Math.round(35 + rand() * 40);

  return { played, wins, draws, losses, goalsFor, goalsAgainst, cleanSheets, form, overRate, bttsRate };
}

function buildHeadToHead(homeName: string, awayName: string, seedKey: string): ProviderHeadToHead[] {
  const rand = seededRandom(hashString(seedKey));

  return Array.from({ length: 3 }, (_, i) => {
    const playedAt = new Date();
    playedAt.setMonth(playedAt.getMonth() - (i + 1) * 6);
    const swap = i % 2 === 1;

    return {
      playedAt: playedAt.toISOString(),
      competition: 'Confrontation precedente',
      homeTeam: swap ? awayName : homeName,
      awayTeam: swap ? homeName : awayName,
      homeScore: Math.floor(rand() * 4),
      awayScore: Math.floor(rand() * 4),
    };
  });
}

const ABSENCE_NAMES = ['J. Martin', 'K. Diallo', 'T. Rossi', 'A. Silva', 'M. Novak', 'R. Andersen'];
const ABSENCE_TYPES: ProviderAbsence['type'][] = ['INJURY', 'SUSPENSION', 'OTHER'];

function buildAbsences(teamExternalId: string, side: ProviderAbsence['side']): ProviderAbsence[] {
  const rand = seededRandom(hashString(teamExternalId + side));
  const count = Math.floor(rand() * 3);

  return Array.from({ length: count }, (_, i) => ({
    player: ABSENCE_NAMES[(Math.floor(rand() * ABSENCE_NAMES.length) + i) % ABSENCE_NAMES.length] as string,
    side,
    type: ABSENCE_TYPES[Math.floor(rand() * ABSENCE_TYPES.length)] as ProviderAbsence['type'],
  }));
}

function buildOdds(matchExternalId: string): ProviderOdds[] {
  const rand = seededRandom(hashString(matchExternalId));

  const pHome = 0.28 + rand() * 0.34;
  const pDraw = 0.2 + rand() * 0.1;
  const pAway = Math.max(0.1, 1 - pHome - pDraw);
  const pOver = 0.4 + rand() * 0.35;
  const pBtts = 0.4 + rand() * 0.35;

  const margin = 1.06;
  const toOdds = (p: number) => Math.round((margin / p) * 100) / 100;

  return [
    { matchExternalId, market: 'MATCH_WINNER', selection: 'HOME', value: toOdds(pHome) },
    { matchExternalId, market: 'MATCH_WINNER', selection: 'DRAW', value: toOdds(pDraw) },
    { matchExternalId, market: 'MATCH_WINNER', selection: 'AWAY', value: toOdds(pAway) },
    { matchExternalId, market: 'DOUBLE_CHANCE', selection: 'HOME_OR_DRAW', value: toOdds(pHome + pDraw) },
    { matchExternalId, market: 'DOUBLE_CHANCE', selection: 'DRAW_OR_AWAY', value: toOdds(pDraw + pAway) },
    { matchExternalId, market: 'DOUBLE_CHANCE', selection: 'HOME_OR_AWAY', value: toOdds(pHome + pAway) },
    { matchExternalId, market: 'OVER_UNDER', selection: 'OVER_2_5', value: toOdds(pOver) },
    { matchExternalId, market: 'OVER_UNDER', selection: 'UNDER_2_5', value: toOdds(1 - pOver) },
    { matchExternalId, market: 'BTTS', selection: 'YES', value: toOdds(pBtts) },
    { matchExternalId, market: 'BTTS', selection: 'NO', value: toOdds(1 - pBtts) },
  ] as ProviderOdds[];
}

function buildFinalScore(seedKey: string): { home: number; away: number } {
  const rand = seededRandom(hashString(`${seedKey}-score`));
  return { home: Math.floor(rand() * 4), away: Math.floor(rand() * 4) };
}

interface MatchFixtureSpec {
  home: ProviderTeamRef;
  away: ProviderTeamRef;
  status: MatchStatus;
  kickoffOffsetHours: number;
}

function buildMatch(
  spec: MatchFixtureSpec,
  sport: ProviderSportRef,
  competition: ProviderCompetitionRef,
): ProviderMatch {
  const externalId = `${competition.externalId}-${spec.home.externalId}-${spec.away.externalId}`;
  const kickoffAt = new Date(Date.now() + spec.kickoffOffsetHours * 60 * 60 * 1000).toISOString();

  const match: ProviderMatch = {
    externalId,
    sport,
    competition,
    homeTeam: spec.home,
    awayTeam: spec.away,
    kickoffAt,
    status: spec.status,
    homeStats: buildTeamStats(spec.home.externalId),
    awayStats: buildTeamStats(spec.away.externalId),
    headToHead: buildHeadToHead(spec.home.name, spec.away.name, externalId),
    absences: [...buildAbsences(spec.home.externalId, 'HOME'), ...buildAbsences(spec.away.externalId, 'AWAY')],
  };

  if (spec.status === 'FINISHED') {
    match.finalScore = buildFinalScore(externalId);
  }

  return match;
}

function buildFixtures() {
  const matches: ProviderMatch[] = [];
  const odds: ProviderOdds[] = [];

  for (const competition of COMPETITIONS) {
    const teams = TEAMS_BY_COMPETITION[competition.externalId] ?? [];
    if (teams.length < 4) continue;

    const specs: MatchFixtureSpec[] = [
      { home: teams[0]!, away: teams[1]!, status: 'FINISHED', kickoffOffsetHours: -14 * 24 },
      { home: teams[2]!, away: teams[3]!, status: 'FINISHED', kickoffOffsetHours: -7 * 24 },
      { home: teams[1]!, away: teams[2]!, status: 'LIVE', kickoffOffsetHours: -0.5 },
      { home: teams[3]!, away: teams[0]!, status: 'SCHEDULED', kickoffOffsetHours: 48 },
      { home: teams[0]!, away: teams[2]!, status: 'SCHEDULED', kickoffOffsetHours: 120 },
    ];

    for (const spec of specs) {
      const match = buildMatch(spec, SPORT, competition);
      matches.push(match);
      odds.push(...buildOdds(match.externalId));
    }
  }

  return { matches, odds };
}

const fixtures = buildFixtures();

export const ALL_MATCHES = fixtures.matches;
export const ALL_ODDS = fixtures.odds;
export const buildTeamStatsFor = buildTeamStats;
