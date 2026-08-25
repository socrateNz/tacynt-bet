'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { PredictionCard } from '@/features/predictions/components/prediction-card';
import { usePredictions } from '@/hooks/use-predictions';

export function RecommendedPredictions() {
  const { data, isLoading } = usePredictions({ upcomingOnly: true, sort: 'confidence', page: 1, limit: 3 });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Aucun pronostic disponible pour le moment. Analysez un match pour en generer.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.items.map((prediction) => (
        <PredictionCard key={prediction.id} prediction={prediction} />
      ))}
    </div>
  );
}
