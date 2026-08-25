'use client';

import Link from 'next/link';
import { Sparkles, Star } from 'lucide-react';
import type { MatchListItem } from '@tacynt/shared';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { formatMatchDate, formatMatchTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAddFavorite, useRemoveFavorite } from '@/hooks/use-favorites';
import { useAuthStore } from '@/store/auth-store';

import { MatchStatusBadge } from './match-status-badge';
import { TeamAvatar } from './team-avatar';

export function MatchCard({ match }: { match: MatchListItem }) {
  const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken));
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const toggleFavorite = () => {
    if (match.isFavorite && match.favoriteId) {
      removeFavorite.mutate(match.favoriteId);
    } else {
      addFavorite.mutate({ type: 'MATCH', refId: match.id });
    }
  };

  const homeOdds = match.mainOdds?.selections.find((selection) => selection.selection === 'HOME');
  const drawOdds = match.mainOdds?.selections.find((selection) => selection.selection === 'DRAW');
  const awayOdds = match.mainOdds?.selections.find((selection) => selection.selection === 'AWAY');

  return (
    <Card className="gap-4">
      <CardHeader className="flex-row items-center justify-between">
        <div className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-xs">
          <span className="truncate">{match.competition.name}</span>
          <span>&middot;</span>
          <span className="shrink-0">
            {formatMatchDate(match.kickoffAt)} &middot; {formatMatchTime(match.kickoffAt)}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <MatchStatusBadge status={match.status} />
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={toggleFavorite}
              disabled={addFavorite.isPending || removeFavorite.isPending}
              aria-label={match.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Star className={cn('size-4', match.isFavorite && 'fill-primary text-primary')} />
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <TeamAvatar name={match.homeTeam.name} logo={match.homeTeam.logo} />
            <span className="text-sm font-medium">{match.homeTeam.shortName ?? match.homeTeam.name}</span>
          </div>
          <span className="text-muted-foreground text-xs font-medium">VS</span>
          <div className="flex flex-col items-center gap-2 text-center">
            <TeamAvatar name={match.awayTeam.name} logo={match.awayTeam.logo} />
            <span className="text-sm font-medium">{match.awayTeam.shortName ?? match.awayTeam.name}</span>
          </div>
        </div>

        {match.mainOdds ? (
          <div className="grid grid-cols-3 gap-2">
            <OddsPill label="1" value={homeOdds?.value} />
            <OddsPill label="N" value={drawOdds?.value} />
            <OddsPill label="2" value={awayOdds?.value} />
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={ROUTES.matchDetail(match.id)}>Voir le match</Link>
        </Button>
        <Button className="flex-1" asChild>
          <Link href={ROUTES.matchDetail(match.id)}>
            <Sparkles /> Analyser
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function OddsPill({ label, value }: { label: string; value?: number }) {
  return (
    <div className="border-border bg-muted/30 flex items-center justify-between rounded-md border px-2 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value?.toFixed(2) ?? '-'}</span>
    </div>
  );
}
