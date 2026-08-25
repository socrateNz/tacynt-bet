import type { Coupon } from '@tacynt/shared';

import { CouponCard } from './coupon-card';

export function CouponResults({ coupons, targetOdds }: { coupons: Coupon[]; targetOdds: number }) {
  return (
    <div className="space-y-6">
      <div className="border-border flex flex-wrap items-baseline justify-between gap-4 border-t pt-6">
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Cote cible</p>
          <p className="text-3xl font-semibold">{targetOdds.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Coupons trouves
          </p>
          <p className="text-lg font-medium">
            {coupons.map((coupon) => coupon.actualOdds.toFixed(2)).join(' · ')}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((coupon, index) => (
          <CouponCard key={coupon.id} coupon={coupon} index={index} />
        ))}
      </div>
    </div>
  );
}
