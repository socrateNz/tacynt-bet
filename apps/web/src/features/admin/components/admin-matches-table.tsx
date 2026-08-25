'use client';

import * as React from 'react';
import { RefreshCw } from 'lucide-react';
import type { MatchStatus } from '@tacynt/config';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMatches } from '@/hooks/use-matches';
import { useSyncMatches } from '@/hooks/use-admin';

const PAGE_SIZE = 20;
const STATUS_OPTIONS: MatchStatus[] = ['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED'];
const STATUS_LABELS: Record<MatchStatus, string> = {
  SCHEDULED: 'Programme',
  LIVE: 'En direct',
  FINISHED: 'Termine',
  POSTPONED: 'Reporte',
  CANCELLED: 'Annule',
};

export function AdminMatchesTable() {
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState<MatchStatus | 'ALL'>('ALL');
  const { data, isLoading } = useMatches({
    page,
    limit: PAGE_SIZE,
    status: status === 'ALL' ? undefined : status,
  });
  const syncMatches = useSyncMatches();

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as MatchStatus | 'ALL');
            setPage(1);
          }}
        >
          <SelectTrigger size="sm" className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {STATUS_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="sm" disabled={syncMatches.isPending} onClick={() => syncMatches.mutate()}>
          <RefreshCw className={syncMatches.isPending ? 'animate-spin' : ''} />
          Synchroniser les matchs
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match</TableHead>
              <TableHead>Competition</TableHead>
              <TableHead>Coup d&apos;envoi</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{match.competition.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(match.kickoffAt).toLocaleString('fr-FR')}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{STATUS_LABELS[match.status]}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {data?.items.length === 0 ? <p className="text-muted-foreground text-sm">Aucun match trouve.</p> : null}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Precedent
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {page} / {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Suivant
          </Button>
        </div>
      ) : null}
    </div>
  );
}
