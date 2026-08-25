'use client';

import * as React from 'react';
import type { Coupon } from '@tacynt/shared';

import { AuthGuard } from '@/features/auth/components/auth-guard';
import { CouponGeneratorForm } from '@/features/coupons/components/coupon-generator-form';
import { CouponResults } from '@/features/coupons/components/coupon-results';

function CouponCreateForm() {
  const [result, setResult] = React.useState<{ coupons: Coupon[]; targetOdds: number } | null>(null);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Creer un coupon</h1>
        <p className="text-muted-foreground text-sm">
          Choisissez une cote cible et un profil de risque : Tacynt Bet construit plusieurs
          coupons proches de votre objectif, a partir des matchs deja analyses.
        </p>
      </div>

      <CouponGeneratorForm onGenerated={(coupons, targetOdds) => setResult({ coupons, targetOdds })} />

      {result ? <CouponResults coupons={result.coupons} targetOdds={result.targetOdds} /> : null}

      <p className="text-muted-foreground border-border border-t pt-6 text-center text-xs leading-relaxed">
        Les analyses et pronostics proposes par Tacynt Bet sont generes a partir de donnees
        statistiques et de modeles d&apos;intelligence artificielle. Ils ne constituent pas une
        garantie de resultat.
      </p>
    </div>
  );
}

export function CouponCreatePageContent() {
  return (
    <AuthGuard>
      <CouponCreateForm />
    </AuthGuard>
  );
}
