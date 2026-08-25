import type { PerformanceBreakdown } from '@tacynt/shared';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PerformanceBreakdownList({
  title,
  items,
  dictionary,
}: {
  title: string;
  items: PerformanceBreakdown[];
  /** Traduit item.label (ex: cle de marche/risque) en libelle affichable. Optionnel pour les sports (deja lisibles). */
  dictionary?: Record<string, string>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">Pas encore de donnees.</p>
        ) : (
          items.map((item) => (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{dictionary?.[item.label] ?? item.label}</span>
                <span className="text-muted-foreground text-xs">
                  {item.won}G / {item.lost}P{item.successRate !== null ? ` · ${item.successRate}%` : ''} (
                  {item.total})
                </span>
              </div>
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${item.successRate ?? 0}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
