import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { MatchDetailContent } from './match-detail-content';

export const metadata: Metadata = {
  title: 'Match | Tacynt Bet',
};

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <MatchDetailContent id={id} />
    </div>
  );
}
