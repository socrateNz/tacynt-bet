'use client';

import type { ComponentType } from 'react';
import { CheckCircle2, Sparkles, Ticket, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '@/hooks/use-dashboard';

export function StatsOverview() {
  const { data, isLoading } = useDashboardStats();

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
      <StatCard label="Analyses IA" value={data?.analysesCount ?? 0} icon={Sparkles} />
      <StatCard label="Coupons generes" value={data?.couponsGeneratedCount ?? 0} icon={Ticket} />
      <StatCard label="Coupons sauvegardes" value={data?.couponsSavedCount ?? 0} icon={CheckCircle2} />
      <StatCard
        label={
          data?.settledPredictionsCount
            ? `Taux de reussite (${data.settledPredictionsCount})`
            : 'Taux de reussite (bientot disponible)'
        }
        value={data?.successRate !== null && data?.successRate !== undefined ? `${data.successRate}%` : '—'}
        icon={TrendingUp}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-semibold">{value}</p>
          <p className="text-muted-foreground text-xs">{label}</p>
        </div>
        <Icon className="text-primary size-6" />
      </CardContent>
    </Card>
  );
}
