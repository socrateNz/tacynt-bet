import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { AdminMatchesContent } from './matches-content';

export const metadata: Metadata = {
  title: 'Matchs | Administration | Tacynt Bet',
};

export default function AdminMatchesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <AdminMatchesContent />
    </div>
  );
}
