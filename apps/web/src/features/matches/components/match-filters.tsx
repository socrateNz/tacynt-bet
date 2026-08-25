'use client';

import { X } from 'lucide-react';
import { MATCH_STATUSES, type MatchStatus } from '@tacynt/config';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompetitions } from '@/hooks/use-competitions';
import { useAuthStore } from '@/store/auth-store';
import { useMatchFiltersStore } from '@/store/match-filters-store';

const STATUS_LABELS: Record<MatchStatus, string> = {
  SCHEDULED: 'A venir',
  LIVE: 'En direct',
  FINISHED: 'Termine',
  POSTPONED: 'Reporte',
  CANCELLED: 'Annule',
};

const ALL_VALUE = 'all';

export function MatchFilters() {
  const { data: competitions } = useCompetitions();
  const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken));
  const sport = useMatchFiltersStore((state) => state.sport);
  const competition = useMatchFiltersStore((state) => state.competition);
  const date = useMatchFiltersStore((state) => state.date);
  const status = useMatchFiltersStore((state) => state.status);
  const favoritesOnly = useMatchFiltersStore((state) => state.favoritesOnly);
  const setFilter = useMatchFiltersStore((state) => state.setFilter);
  const reset = useMatchFiltersStore((state) => state.reset);

  const sports = Array.from(new Map((competitions ?? []).map((c) => [c.sport.slug, c.sport])).values());

  const hasActiveFilters = Boolean(sport || competition || date || status || favoritesOnly);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={sport ?? ALL_VALUE}
        onValueChange={(value) => setFilter('sport', value === ALL_VALUE ? undefined : value)}
      >
        <SelectTrigger size="sm" className="w-[140px]">
          <SelectValue placeholder="Sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Tous les sports</SelectItem>
          {sports.map((s) => (
            <SelectItem key={s.slug} value={s.slug}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={competition ?? ALL_VALUE}
        onValueChange={(value) => setFilter('competition', value === ALL_VALUE ? undefined : value)}
      >
        <SelectTrigger size="sm" className="w-[180px]">
          <SelectValue placeholder="Competition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Toutes les competitions</SelectItem>
          {(competitions ?? []).map((c) => (
            <SelectItem key={c.slug} value={c.slug}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status ?? ALL_VALUE}
        onValueChange={(value) => setFilter('status', value === ALL_VALUE ? undefined : (value as MatchStatus))}
      >
        <SelectTrigger size="sm" className="w-[140px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Tous les statuts</SelectItem>
          {MATCH_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={date ?? ''}
        onChange={(event) => setFilter('date', event.target.value || undefined)}
        className="h-8 w-[150px]"
      />

      {isAuthenticated ? (
        <Button
          type="button"
          variant={favoritesOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('favoritesOnly', !favoritesOnly)}
        >
          Favoris uniquement
        </Button>
      ) : null}

      {hasActiveFilters ? (
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          <X /> Reinitialiser
        </Button>
      ) : null}
    </div>
  );
}
