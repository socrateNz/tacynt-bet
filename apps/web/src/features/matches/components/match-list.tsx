'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMatches } from '@/hooks/use-matches';
import { useMatchFiltersStore } from '@/store/match-filters-store';

import { MatchCard } from './match-card';

const PAGE_SIZE = 12;

export function MatchList() {
  const sport = useMatchFiltersStore((state) => state.sport);
  const competition = useMatchFiltersStore((state) => state.competition);
  const date = useMatchFiltersStore((state) => state.date);
  const status = useMatchFiltersStore((state) => state.status);
  const favoritesOnly = useMatchFiltersStore((state) => state.favoritesOnly);

  const filtersKey = JSON.stringify({ sport, competition, date, status, favoritesOnly });
  const [page, setPage] = React.useState(1);
  const [appliedFiltersKey, setAppliedFiltersKey] = React.useState(filtersKey);

  if (filtersKey !== appliedFiltersKey) {
    setAppliedFiltersKey(filtersKey);
    setPage(1);
  }

  const { data, isLoading, isError } = useMatches({
    sport,
    competition,
    date,
    status,
    favoritesOnly: favoritesOnly || undefined,
    page,
    limit: PAGE_SIZE,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-muted-foreground py-16 text-center text-sm">
        Impossible de charger les matchs pour le moment.
      </p>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="border-border rounded-xl border border-dashed py-16 text-center">
        <p className="text-muted-foreground text-sm">Aucun match ne correspond a ces filtres.</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Precedent
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      ) : null}
    </div>
  );
}
