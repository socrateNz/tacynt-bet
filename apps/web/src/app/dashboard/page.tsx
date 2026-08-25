import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { DashboardPageContent } from './dashboard-content';

export const metadata: Metadata = {
  title: 'Tableau de bord | Tacynt Bet',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <DashboardPageContent />
    </div>
  );
}
