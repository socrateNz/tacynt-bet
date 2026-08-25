import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { AdminOverviewContent } from './admin-content';

export const metadata: Metadata = {
  title: 'Administration | Tacynt Bet',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <AdminOverviewContent />
    </div>
  );
}
