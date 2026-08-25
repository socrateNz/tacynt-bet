'use client';

import * as React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { CouponCard } from '@/features/coupons/components/coupon-card';
import { useCoupons } from '@/hooks/use-coupons';

const PAGE_SIZE = 12;

function CouponsList() {
  const [savedOnly, setSavedOnly] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError } = useCoupons({
    savedOnly: savedOnly || undefined,
    page,
    limit: PAGE_SIZE,
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground text-sm">
            Retrouvez vos coupons generes et sauvegardes.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.couponCreate}>Creer un coupon</Link>
        </Button>
      </div>

      <Button
        type="button"
        variant={savedOnly ? 'default' : 'outline'}
        size="sm"
        onClick={() => {
          setSavedOnly((current) => !current);
          setPage(1);
        }}
      >
        Sauvegardes uniquement
      </Button>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-muted-foreground py-16 text-center text-sm">
          Impossible de charger vos coupons pour le moment.
        </p>
      ) : !data || data.items.length === 0 ? (
        <div className="border-border rounded-xl border border-dashed py-16 text-center">
          <p className="text-muted-foreground text-sm">
            {savedOnly ? "Vous n'avez pas encore sauvegarde de coupon." : "Vous n'avez pas encore genere de coupon."}
          </p>
          <Button className="mt-4" asChild>
            <Link href={ROUTES.couponCreate}>Creer mon premier coupon</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((coupon, index) => (
              <CouponCard key={coupon.id} coupon={coupon} index={index} />
            ))}
          </div>

          {Math.ceil(data.total / data.limit) > 1 ? (
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Precedent
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {page} / {Math.ceil(data.total / data.limit)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(data.total / data.limit)}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export function CouponsPageContent() {
  return (
    <AuthGuard>
      <CouponsList />
    </AuthGuard>
  );
}
