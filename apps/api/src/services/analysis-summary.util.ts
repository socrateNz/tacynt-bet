import type { HydratedDocument } from 'mongoose';
import type { RiskLevel } from '@tacynt/config';
import type { DashboardAnalysisSummary } from '@tacynt/shared';

import type { IAIAnalysis, ICompetition, IMatch, ITeam } from '../models';
import { orUndefined } from '../utils/mongoose';

type PopulatedMatchRef = Omit<HydratedDocument<IMatch>, 'competitionId' | 'homeTeamId' | 'awayTeamId'> & {
  competitionId: HydratedDocument<ICompetition>;
  homeTeamId: HydratedDocument<ITeam>;
  awayTeamId: HydratedDocument<ITeam>;
};

export type PopulatedAnalysis = Omit<HydratedDocument<IAIAnalysis>, 'matchId'> & {
  matchId: PopulatedMatchRef;
};

/** A reutiliser avec .populate(ANALYSIS_MATCH_POPULATE) partout ou une AIAnalysis doit exposer son contexte match. */
export const ANALYSIS_MATCH_POPULATE = {
  path: 'matchId',
  populate: [{ path: 'competitionId' }, { path: 'homeTeamId' }, { path: 'awayTeamId' }],
};

export function mapAnalysisToSummary(analysis: PopulatedAnalysis): DashboardAnalysisSummary {
  return {
    id: analysis.id,
    matchId: analysis.matchId.id,
    match: {
      homeTeam: {
        id: analysis.matchId.homeTeamId.id,
        name: analysis.matchId.homeTeamId.name,
        shortName: orUndefined(analysis.matchId.homeTeamId.shortName),
        slug: analysis.matchId.homeTeamId.slug,
        logo: orUndefined(analysis.matchId.homeTeamId.logo),
      },
      awayTeam: {
        id: analysis.matchId.awayTeamId.id,
        name: analysis.matchId.awayTeamId.name,
        shortName: orUndefined(analysis.matchId.awayTeamId.shortName),
        slug: analysis.matchId.awayTeamId.slug,
        logo: orUndefined(analysis.matchId.awayTeamId.logo),
      },
      competition: {
        id: analysis.matchId.competitionId.id,
        name: analysis.matchId.competitionId.name,
        slug: analysis.matchId.competitionId.slug,
        country: orUndefined(analysis.matchId.competitionId.country),
        logo: orUndefined(analysis.matchId.competitionId.logo),
      },
      kickoffAt: analysis.matchId.kickoffAt.toISOString(),
    },
    summary: analysis.summary,
    confidence: analysis.confidence,
    risk: analysis.risk as RiskLevel,
    createdAt: analysis.createdAt.toISOString(),
  };
}
