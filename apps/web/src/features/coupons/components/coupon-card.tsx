'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bookmark, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Coupon } from '@tacynt/shared';
import { RISK_PROFILE_LABELS } from '@tacynt/config';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { MARKET_LABELS, RISK_LABELS, SELECTION_LABELS } from '@/lib/betting-labels';
import { cn } from '@/lib/utils';
import { useSaveCoupon } from '@/hooks/use-coupons';

export function CouponCard({ coupon, index }: { coupon: Coupon; index: number }) {
  const [justSaved, setJustSaved] = React.useState(false);
  const save = useSaveCoupon();
  const isSaved = coupon.isSaved || justSaved;
  const label = String.fromCharCode(65 + (index % 26));
  const gap = coupon.actualOdds - coupon.targetOdds;

  const handleShare = async () => {
    const url = `${window.location.origin}${ROUTES.couponDetail(coupon.id)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Coupon Tacynt Bet', url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Lien copie dans le presse-papiers.');
      }
    } catch {
      // partage annule par l'utilisateur - rien a faire
    }
  };

  return (
    <Card className="gap-4">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-muted flex size-7 items-center justify-center rounded-full text-xs font-semibold">
            {label}
          </span>
          <Badge variant="outline">{RISK_PROFILE_LABELS[coupon.riskProfile]}</Badge>
        </div>
        <Badge variant="outline">{RISK_LABELS[coupon.risk] ?? coupon.risk}</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-2xl font-semibold">{coupon.actualOdds.toFixed(2)}</p>
            <p className="text-muted-foreground text-xs">
              Ecart cible ({coupon.targetOdds.toFixed(2)}) : {gap >= 0 ? '+' : ''}
              {gap.toFixed(2)}
            </p>
          </div>
          <div className="text-right text-xs">
            <p className="text-muted-foreground">{coupon.selections.length} selections</p>
            <p className="text-muted-foreground">{coupon.averageConfidence}% confiance</p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {coupon.selections.map((selection) => (
            <li key={selection.id} className="text-sm">
              <p className="font-medium">
                {selection.match.homeTeam.name} vs {selection.match.awayTeam.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {MARKET_LABELS[selection.market] ?? selection.market} &middot;{' '}
                {SELECTION_LABELS[selection.selection] ?? selection.selection} &middot;{' '}
                {selection.odds.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={ROUTES.couponDetail(coupon.id)}>Voir le coupon</Link>
        </Button>
        <Button
          variant={isSaved ? 'default' : 'outline'}
          size="icon"
          className="size-8"
          onClick={() => save.mutate(coupon.id, { onSuccess: () => setJustSaved(true) })}
          disabled={isSaved || save.isPending}
          aria-label="Sauvegarder"
        >
          <Bookmark className={cn('size-4', isSaved && 'fill-current')} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={handleShare}
          aria-label="Partager"
        >
          <Share2 className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
