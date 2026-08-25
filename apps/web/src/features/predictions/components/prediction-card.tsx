import Link from 'next/link';
import type { PredictionListItem } from '@tacynt/shared';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { formatMatchDate, formatMatchTime } from '@/lib/format';
import { MARKET_LABELS, RISK_LABELS, SELECTION_LABELS } from '@/lib/betting-labels';

export function PredictionCard({ prediction }: { prediction: PredictionListItem }) {
  return (
    <Card className="gap-4">
      <CardHeader className="flex-row items-center justify-between">
        <div className="text-muted-foreground min-w-0 truncate text-xs">
          {prediction.match.competition.name} &middot; {formatMatchDate(prediction.match.kickoffAt)}{' '}
          &middot; {formatMatchTime(prediction.match.kickoffAt)}
        </div>
        <Badge variant="outline" className="shrink-0">
          {RISK_LABELS[prediction.risk] ?? prediction.risk}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link
          href={ROUTES.matchDetail(prediction.matchId)}
          className="block text-sm font-medium hover:underline"
        >
          {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
        </Link>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">
              {MARKET_LABELS[prediction.market] ?? prediction.market} &middot;{' '}
              {SELECTION_LABELS[prediction.selection] ?? prediction.selection}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">{prediction.reason}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-primary text-lg font-semibold">{prediction.odds.toFixed(2)}</p>
            <p className="text-muted-foreground text-xs">{prediction.confidence}% confiance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
