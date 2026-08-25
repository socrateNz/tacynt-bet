'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { MatchCard } from '@/features/matches/components/match-card';
import { useMatches } from '@/hooks/use-matches';

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TodaysMatches() {
  const { data, isLoading } = useMatches({ date: todayISODate(), page: 1, limit: 6 });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return <p className="text-muted-foreground text-sm">Aucun match programme aujourd&apos;hui.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.items.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
