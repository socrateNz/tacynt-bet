'use client';

import { CircleDollarSign, Sparkles, Ticket, Trophy, Users } from 'lucide-react';

import { StatCard } from '@/components/stat-card';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminOverview } from '@/hooks/use-admin';
import { ROLE_LABELS } from '@/lib/betting-labels';

export function AdminOverviewStats() {
  const { data, isLoading } = useAdminOverview();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Utilisateurs" value={data?.totalUsers ?? 0} icon={Users} />
        <StatCard label="Matchs" value={data?.totalMatches ?? 0} icon={Trophy} />
        <StatCard label="Analyses IA" value={data?.totalAnalyses ?? 0} icon={Sparkles} />
        <StatCard label="Coupons generes" value={data?.totalCoupons ?? 0} icon={Ticket} />
        <StatCard
          label="Cout IA total"
          value={`$${(data?.totalAiCost ?? 0).toFixed(4)}`}
          icon={CircleDollarSign}
        />
      </div>

      <Card>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Utilisateurs par role</p>
            <ul className="space-y-1">
              {data?.usersByRole.map((entry) => (
                <li key={entry.role} className="text-muted-foreground flex justify-between text-sm">
                  <span>{ROLE_LABELS[entry.role] ?? entry.role}</span>
                  <span className="text-foreground font-medium">{entry.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Utilisateurs par plan</p>
            <ul className="space-y-1">
              {data?.usersByPlan.map((entry) => (
                <li key={entry.plan} className="text-muted-foreground flex justify-between text-sm">
                  <span>{entry.plan === 'PREMIUM' ? 'Premium' : 'Gratuit'}</span>
                  <span className="text-foreground font-medium">{entry.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
