import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { AdminAnalyticsContent } from './analytics-content';

export const metadata: Metadata = {
  title: 'Analytique | Administration | Tacynt Bet',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <AdminAnalyticsContent />
    </div>
  );
}
