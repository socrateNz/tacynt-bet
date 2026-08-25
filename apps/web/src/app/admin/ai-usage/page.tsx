import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { AdminAiUsageContent } from './ai-usage-content';

export const metadata: Metadata = {
  title: 'Usage IA | Administration | Tacynt Bet',
};

export default function AdminAiUsagePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <AdminAiUsageContent />
    </div>
  );
}
