'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { useRecentAnalyses } from '@/hooks/use-dashboard';
import { RISK_LABELS } from '@/lib/betting-labels';

export function RecentAnalyses() {
  const { data, isLoading } = useRecentAnalyses();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-sm">Aucune analyse pour le moment.</p>;
  }

  return (
    <div className="space-y-3">
      {data.map((analysis) => (
        <Link key={analysis.id} href={ROUTES.matchDetail(analysis.matchId)}>
          <Card className="hover:bg-muted/30 transition-colors">
            <CardContent className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {analysis.match.homeTeam.name} vs {analysis.match.awayTeam.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">{analysis.summary}</p>
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
  );
}
