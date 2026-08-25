import type { HeadToHeadEntry } from '@tacynt/shared';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMatchDate } from '@/lib/format';

export function MatchHeadToHead({ entries }: { entries: HeadToHeadEntry[] }) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confrontations directes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground w-16 shrink-0 text-xs">
              {formatMatchDate(entry.playedAt)}
            </span>
            <span className="flex-1 truncate text-right font-medium">{entry.homeTeam}</span>
            <span className="text-muted-foreground mx-3 shrink-0 font-semibold">
              {entry.homeScore} - {entry.awayScore}
            </span>
            <span className="flex-1 truncate text-left font-medium">{entry.awayTeam}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
