import type { MarketOdds } from '@tacynt/shared';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { MARKET_LABELS, SELECTION_LABELS } from '@/lib/betting-labels';

export function MatchOdds({ odds }: { odds: MarketOdds[] }) {
  if (odds.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cotes disponibles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {odds.map((market) => (
          <div key={market.market}>
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              {MARKET_LABELS[market.market] ?? market.market}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {market.selections.map((selection) => (
                <div
                  key={selection.selection}
                  className="border-border bg-muted/30 rounded-md border px-3 py-2 text-center"
                >
                  <p className="text-muted-foreground text-xs">
                    {SELECTION_LABELS[selection.selection] ?? selection.selection}
                  </p>
                  <p className="text-sm font-semibold">{selection.value.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
