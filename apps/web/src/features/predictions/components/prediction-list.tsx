'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePredictions } from '@/hooks/use-predictions';

import { PredictionCard } from './prediction-card';
import { PredictionFilters, type PredictionFiltersValue } from './prediction-filters';

const PAGE_SIZE = 12;

export function PredictionList() {
  const [filters, setFilters] = React.useState<PredictionFiltersValue>({ upcomingOnly: true });
  const filtersKey = JSON.stringify(filters);
  const [page, setPage] = React.useState(1);
  const [appliedFiltersKey, setAppliedFiltersKey] = React.useState(filtersKey);

  if (filtersKey !== appliedFiltersKey) {
    setAppliedFiltersKey(filtersKey);
    setPage(1);
  }

  const { data, isLoading, isError } = usePredictions({
    market: filters.market,
    risk: filters.risk,
    upcomingOnly: filters.upcomingOnly || undefined,
    page,
    limit: PAGE_SIZE,
  });

  return (
    <div className="space-y-6">
      <PredictionFilters value={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-muted-foreground py-16 text-center text-sm">
          Impossible de charger les pronostics pour le moment.
        </p>
      ) : !data || data.items.length === 0 ? (
        <div className="border-border rounded-xl border border-dashed py-16 text-center">
          <p className="text-muted-foreground text-sm">
            Aucun pronostic ne correspond a ces filtres pour le moment. Analysez un match pour en
            generer.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>

          {Math.ceil(data.total / data.limit) > 1 ? (
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Precedent
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {page} / {Math.ceil(data.total / data.limit)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(data.total / data.limit)}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
