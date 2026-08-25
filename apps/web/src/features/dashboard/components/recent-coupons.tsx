'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { CouponCard } from '@/features/coupons/components/coupon-card';
import { useCoupons } from '@/hooks/use-coupons';

export function RecentCoupons() {
  const { data, isLoading } = useCoupons({ page: 1, limit: 4 });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-72 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return <p className="text-muted-foreground text-sm">Aucun coupon genere pour le moment.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.items.map((coupon, index) => (
        <CouponCard key={coupon.id} coupon={coupon} index={index} />
      ))}
    </div>
  );
}
