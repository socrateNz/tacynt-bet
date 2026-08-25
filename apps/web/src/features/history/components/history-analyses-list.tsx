'use client';

import * as React from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { useHistoryAnalyses } from '@/hooks/use-history';
import { RISK_LABELS } from '@/lib/betting-labels';

const PAGE_SIZE = 10;

export function HistoryAnalysesList() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useHistoryAnalyses(page, PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return <p className="text-muted-foreground text-sm">Aucune analyse pour le moment.</p>;
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {data.items.map((analysis) => (
          <Link key={analysis.id} href={ROUTES.matchDetail(analysis.matchId)}>
            <Card className="hover:bg-muted/30 transition-colors">
              <CardContent className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {analysis.match.homeTeam.name} vs {analysis.match.awayTeam.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">{analysis.summary}</p>
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    {new Date(analysis.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">{analysis.confidence}%</p>
                  <Badge variant="outline" className="text-[10px]">
                    {RISK_LABELS[analysis.risk] ?? analysis.risk}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Precedent
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      ) : null}
    </div>
  );
}
