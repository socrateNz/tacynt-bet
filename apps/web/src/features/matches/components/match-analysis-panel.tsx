import type { AIAnalysisResult } from '@tacynt/shared';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { MARKET_LABELS, RISK_LABELS, SELECTION_LABELS } from '@/lib/betting-labels';

export function MatchAnalysisPanel({ analysis }: { analysis: AIAnalysisResult }) {
  const [mainPrediction, ...otherPredictions] = analysis.predictions;

  return (
    <Card className="border-primary/30">
      <CardHeader className="flex-row items-start justify-between">
        <CardTitle className="flex items-center gap-2">
          Analyse Tacynt AI
          {analysis.cached ? (
            <Badge variant="outline" className="text-muted-foreground text-[10px]">
              Mise en cache
            </Badge>
          ) : null}
        </CardTitle>
        <div className="text-right">
          <p className="text-2xl font-semibold">{analysis.confidence}%</p>
          <p className="text-muted-foreground text-xs">Confiance globale</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm leading-relaxed">{analysis.summary}</p>

        {mainPrediction ? (
          <div className="border-border bg-muted/30 rounded-lg border p-4">
            <p className="text-muted-foreground mb-1 text-xs font-medium">Pronostic principal</p>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {MARKET_LABELS[mainPrediction.market] ?? mainPrediction.market} &middot;{' '}
                  {SELECTION_LABELS[mainPrediction.selection] ?? mainPrediction.selection}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">{mainPrediction.reason}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-primary text-xl font-semibold">{mainPrediction.odds.toFixed(2)}</p>
                <Badge variant="outline" className="mt-1">
                  {RISK_LABELS[mainPrediction.risk] ?? mainPrediction.risk}
                </Badge>
              </div>
            </div>
          </div>
        ) : null}

        {otherPredictions.length > 0 ? (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium">Autres pronostics</p>
            {otherPredictions.map((prediction) => (
              <div key={prediction.id} className="flex items-center justify-between text-sm">
                <span>
                  {MARKET_LABELS[prediction.market] ?? prediction.market} &middot;{' '}
                  {SELECTION_LABELS[prediction.selection] ?? prediction.selection}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">{prediction.confidence}%</span>
                  <span className="font-medium">{prediction.odds.toFixed(2)}</span>
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-primary mb-2 text-xs font-medium">Facteurs favorables</p>
            <ul className="space-y-1.5 text-sm">
              {analysis.favorableFactors.map((factor, index) => (
                <li key={index} className="text-muted-foreground">
                  {factor}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-destructive mb-2 text-xs font-medium">Facteurs de risque</p>
            <ul className="space-y-1.5 text-sm">
              {analysis.riskFactors.map((factor, index) => (
                <li key={index} className="text-muted-foreground">
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
