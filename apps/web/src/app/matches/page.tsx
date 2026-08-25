import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';
import { MatchFilters } from '@/features/matches/components/match-filters';
import { MatchList } from '@/features/matches/components/match-list';

export const metadata: Metadata = {
  title: 'Matchs | Tacynt Bet',
};

export default function MatchesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-12">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Matchs</h1>
          <p className="text-muted-foreground text-sm">
            Consultez les rencontres disponibles et leurs statistiques.
          </p>
        </div>
        <MatchFilters />
        <MatchList />
      </div>
    </div>
  );
}
