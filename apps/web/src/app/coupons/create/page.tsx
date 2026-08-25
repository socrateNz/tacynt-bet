import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { CouponCreatePageContent } from './coupon-create-content';

export const metadata: Metadata = {
  title: 'Creer un coupon | Tacynt Bet',
};

export default function CouponCreatePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <CouponCreatePageContent />
    </div>
  );
}
