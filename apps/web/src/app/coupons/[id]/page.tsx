import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { CouponDetailPageContent } from './coupon-detail-content';

export const metadata: Metadata = {
  title: 'Coupon | Tacynt Bet',
};

export default async function CouponDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <CouponDetailPageContent id={id} />
    </div>
  );
}
