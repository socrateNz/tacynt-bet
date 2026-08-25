'use client';

import { ROUTES } from '@/constants/routes';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { RecentCoupons } from '@/features/dashboard/components/recent-coupons';
import { SectionHeader } from '@/features/dashboard/components/section-header';
import { HistoryAnalysesList } from '@/features/history/components/history-analyses-list';
import { HistoryStatsOverview } from '@/features/history/components/history-stats-overview';
import { PerformanceBreakdownList } from '@/features/history/components/performance-breakdown-list';
import { useHistoryStats } from '@/hooks/use-history';
import { MARKET_LABELS, RISK_LABELS } from '@/lib/betting-labels';

function HistoryBody() {
  const { data: stats } = useHistoryStats();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Historique</h1>
        <p className="text-muted-foreground text-sm">
          Vos analyses passees et vos performances de pronostics.
        </p>
      </div>

      <HistoryStatsOverview />

      <div className="grid gap-4 lg:grid-cols-3">
        <PerformanceBreakdownList title="Performance par sport" items={stats?.performanceBySport ?? []} />
        <PerformanceBreakdownList
          title="Performance par marche"
          items={stats?.performanceByMarket ?? []}
          dictionary={MARKET_LABELS}
        />
        <PerformanceBreakdownList
          title="Performance par risque"
          items={stats?.performanceByRisk ?? []}
          dictionary={RISK_LABELS}
        />
      </div>

      <section>
        <SectionHeader title="Coupons" href={ROUTES.coupons} />
        <RecentCoupons />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Analyses precedentes</h2>
        <HistoryAnalysesList />
      </section>
    </div>
  );
}

export function HistoryPageContent() {
  return (
    <AuthGuard>
      <HistoryBody />
    </AuthGuard>
  );
}
