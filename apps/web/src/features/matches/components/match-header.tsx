'use client';

import { Star } from 'lucide-react';
import type { MatchDetail } from '@tacynt/shared';

import { Button } from '@/components/ui/button';
import { formatMatchDate, formatMatchTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAddFavorite, useRemoveFavorite } from '@/hooks/use-favorites';
import { useAuthStore } from '@/store/auth-store';

import { MatchStatusBadge } from './match-status-badge';
import { TeamAvatar } from './team-avatar';

export function MatchHeader({ match }: { match: MatchDetail }) {
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

  return (
    <div className="bg-card space-y-6 rounded-xl border p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="text-muted-foreground flex items-center gap-2">
          <span>{match.competition.name}</span>
          {match.venue ? (
            <>
              <span>&middot;</span>
              <span>{match.venue}</span>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <MatchStatusBadge status={match.status} />
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={toggleFavorite}
              disabled={addFavorite.isPending || removeFavorite.isPending}
              aria-label={match.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Star className={cn('size-4', match.isFavorite && 'fill-primary text-primary')} />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <TeamAvatar name={match.homeTeam.name} logo={match.homeTeam.logo} className="size-14 text-lg" />
          <span className="font-semibold">{match.homeTeam.name}</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          {match.finalScore ? (
            <span className="text-3xl font-semibold">
              {match.finalScore.home} - {match.finalScore.away}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm font-medium">
              {formatMatchDate(match.kickoffAt)}
              <br />
              {formatMatchTime(match.kickoffAt)}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <TeamAvatar name={match.awayTeam.name} logo={match.awayTeam.logo} className="size-14 text-lg" />
          <span className="font-semibold">{match.awayTeam.name}</span>
        </div>
      </div>
    </div>
  );
}
