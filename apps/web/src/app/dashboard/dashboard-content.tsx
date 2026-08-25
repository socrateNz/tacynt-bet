'use client';

import { ROUTES } from '@/constants/routes';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { RecentAnalyses } from '@/features/dashboard/components/recent-analyses';
import { RecentCoupons } from '@/features/dashboard/components/recent-coupons';
import { RecommendedPredictions } from '@/features/dashboard/components/recommended-predictions';
import { SectionHeader } from '@/features/dashboard/components/section-header';
import { StatsOverview } from '@/features/dashboard/components/stats-overview';
import { TodaysMatches } from '@/features/dashboard/components/todays-matches';
import { useAuthStore } from '@/store/auth-store';

function DashboardBody() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bonjour{user ? `, ${user.name}` : ''}</h1>
        <p className="text-muted-foreground text-sm">Voici un resume de votre activite sur Tacynt Bet.</p>
      </div>

      <StatsOverview />

      <section>
        <SectionHeader title="Matchs du jour" href={ROUTES.matches} />
        <TodaysMatches />
      </section>

      <section>
        <SectionHeader title="Pronostics recommandes" href={ROUTES.predictions} />
        <RecommendedPredictions />
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <SectionHeader title="Analyses recentes" href={ROUTES.matches} />
          <RecentAnalyses />
        </section>
        <section>
          <SectionHeader title="Coupons recents" href={ROUTES.coupons} />
          <RecentCoupons />
        </section>
      </div>
    </div>
  );
}

export function DashboardPageContent() {
  return (
    <AuthGuard>
      <DashboardBody />
    </AuthGuard>
  );
}
