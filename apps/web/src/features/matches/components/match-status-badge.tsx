import type { MatchStatus } from '@tacynt/config';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<MatchStatus, string> = {
  SCHEDULED: 'A venir',
  LIVE: 'En direct',
  FINISHED: 'Termine',
  POSTPONED: 'Reporte',
  CANCELLED: 'Annule',
};

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  return (
    <Badge
      variant={status === 'LIVE' ? 'default' : 'outline'}
      className={cn(status === 'LIVE' && 'animate-pulse')}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
