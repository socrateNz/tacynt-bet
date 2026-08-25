'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Share2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { RISK_PROFILE_LABELS } from '@tacynt/config';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { useCoupon, useDeleteCoupon, useSaveCoupon } from '@/hooks/use-coupons';
import { MARKET_LABELS, RISK_LABELS, SELECTION_LABELS } from '@/lib/betting-labels';
import { cn } from '@/lib/utils';

function CouponDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: coupon, isLoading, isError } = useCoupon(id);
  const [justSaved, setJustSaved] = React.useState(false);
  const save = useSaveCoupon();
  const remove = useDeleteCoupon();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-12">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !coupon) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
        <p className="text-muted-foreground text-sm">Ce coupon est introuvable.</p>
      </div>
    );
  }

  const isSaved = coupon.isSaved || justSaved;
  const gap = coupon.actualOdds - coupon.targetOdds;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Coupon Tacynt Bet', url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Lien copie dans le presse-papiers.');
      }
    } catch {
      // partage annule par l'utilisateur
    }
  };

  const handleDelete = () => {
    remove.mutate(id, {
      onSuccess: () => {
        toast.success('Coupon supprime.');
        router.push(ROUTES.coupons);
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-12">
      <div className="bg-card space-y-6 rounded-xl border p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline">{RISK_PROFILE_LABELS[coupon.riskProfile]}</Badge>
          <Badge variant="outline">{RISK_LABELS[coupon.risk] ?? coupon.risk}</Badge>
        </div>

        <div className="text-center">
          <p className="text-4xl font-semibold">{coupon.actualOdds.toFixed(2)}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Cote cible {coupon.targetOdds.toFixed(2)} &middot; ecart {gap >= 0 ? '+' : ''}
            {gap.toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">{coupon.selections.length}</p>
            <p className="text-muted-foreground text-xs">Selections</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{coupon.averageConfidence}%</p>
            <p className="text-muted-foreground text-xs">Confiance moyenne</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-lg font-semibold">
              {new Date(coupon.createdAt).toLocaleDateString('fr-FR')}
            </p>
            <p className="text-muted-foreground text-xs">Genere le</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={isSaved ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => save.mutate(id, { onSuccess: () => setJustSaved(true) })}
            disabled={isSaved || save.isPending}
          >
            <Bookmark className={cn('size-4', isSaved && 'fill-current')} />
            {isSaved ? 'Sauvegarde' : 'Sauvegarder'}
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare} aria-label="Partager">
            <Share2 className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            disabled={remove.isPending}
            aria-label="Supprimer"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selections</CardTitle>
        </CardHeader>
        <CardContent className="divide-border divide-y">
          {coupon.selections.map((selection) => (
            <div key={selection.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">
                  {selection.match.homeTeam.name} vs {selection.match.awayTeam.name}
                </p>
                <p className="text-primary shrink-0 font-semibold">{selection.odds.toFixed(2)}</p>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {selection.match.competition.name} &middot;{' '}
                {new Date(selection.match.kickoffAt).toLocaleDateString('fr-FR')} &middot;{' '}
                {MARKET_LABELS[selection.market] ?? selection.market} &middot;{' '}
                {SELECTION_LABELS[selection.selection] ?? selection.selection} &middot;{' '}
                {selection.confidence}% confiance
              </p>
              <p className="text-muted-foreground mt-2 text-sm">{selection.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-muted-foreground border-border border-t pt-6 text-center text-xs leading-relaxed">
        Les analyses et pronostics proposes par Tacynt Bet sont generes a partir de donnees
        statistiques et de modeles d&apos;intelligence artificielle. Ils ne constituent pas une
        garantie de resultat.
      </p>
    </div>
  );
}

export function CouponDetailPageContent({ id }: { id: string }) {
  return (
    <AuthGuard>
      <CouponDetail id={id} />
    </AuthGuard>
  );
}
