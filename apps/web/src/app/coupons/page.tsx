import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { CouponsPageContent } from './coupons-content';

export const metadata: Metadata = {
  title: 'Coupons | Tacynt Bet',
};

export default function CouponsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <CouponsPageContent />
    </div>
  );
}
