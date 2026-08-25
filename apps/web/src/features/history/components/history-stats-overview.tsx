'use client';

import { CheckCircle2, ListChecks, TrendingUp, XCircle } from 'lucide-react';

import { StatCard } from '@/components/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useHistoryStats } from '@/hooks/use-history';

export function HistoryStatsOverview() {
  const { data, isLoading } = useHistoryStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Pronostics au total" value={data?.totalPredictions ?? 0} icon={ListChecks} />
      <StatCard label="Gagnants" value={data?.wonPredictions ?? 0} icon={CheckCircle2} />
      <StatCard label="Perdants" value={data?.lostPredictions ?? 0} icon={XCircle} />
      <StatCard
        label={
          data?.settledPredictions
            ? `Taux de reussite (${data.settledPredictions} regles)`
            : 'Taux de reussite (bientot disponible)'
        }
        value={data?.successRate !== null && data?.successRate !== undefined ? `${data.successRate}%` : '—'}
        icon={TrendingUp}
      />
    </div>
  );
}
