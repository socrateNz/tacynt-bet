'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { MatchAbsences } from '@/features/matches/components/match-absences';
import { MatchAnalysisSection } from '@/features/matches/components/match-analysis-section';
import { MatchHeadToHead } from '@/features/matches/components/match-h2h';
import { MatchHeader } from '@/features/matches/components/match-header';
import { MatchOdds } from '@/features/matches/components/match-odds';
import { MatchStats } from '@/features/matches/components/match-stats';
import { useMatch } from '@/hooks/use-matches';

export function MatchDetailContent({ id }: { id: string }) {
  const { data: match, isLoading, isError } = useMatch(id);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-12">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !match) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-24 text-center">
        <p className="text-muted-foreground text-sm">Ce match est introuvable.</p>
      </div>
    );
  }

  const homeAbsences = match.absences.filter((absence) => absence.side === 'HOME');
  const awayAbsences = match.absences.filter((absence) => absence.side === 'AWAY');

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-12">
      <MatchHeader match={match} />

      <MatchAnalysisSection matchId={match.id} />

      <MatchStats homeStats={match.homeStats} awayStats={match.awayStats} />
      <MatchOdds odds={match.odds} />
      <MatchHeadToHead entries={match.headToHead} />
      <MatchAbsences
        homeAbsences={homeAbsences}
        awayAbsences={awayAbsences}
        homeTeamName={match.homeTeam.name}
        awayTeamName={match.awayTeam.name}
      />
    </div>
  );
}
