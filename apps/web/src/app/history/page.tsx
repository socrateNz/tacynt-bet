import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { HistoryPageContent } from './history-content';

export const metadata: Metadata = {
  title: 'Historique | Tacynt Bet',
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <HistoryPageContent />
    </div>
  );
}
