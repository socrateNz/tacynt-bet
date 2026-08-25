import type { TeamMatchStats } from '@tacynt/shared';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ROWS: { label: string; key: keyof TeamMatchStats }[] = [
  { label: 'Victoires', key: 'wins' },
  { label: 'Nuls', key: 'draws' },
  { label: 'Defaites', key: 'losses' },
  { label: 'Buts marques', key: 'goalsFor' },
  { label: 'Buts encaisses', key: 'goalsAgainst' },
  { label: 'Clean sheets', key: 'cleanSheets' },
];

const FORM_COLORS: Record<string, string> = {
  W: 'bg-primary text-primary-foreground',
  D: 'bg-secondary text-secondary-foreground',
  L: 'bg-destructive text-white',
};

function FormBadges({ form }: { form: string[] }) {
  return (
    <div className="flex gap-1">
      {form.map((result, index) => (
        <span
          key={index}
          className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${FORM_COLORS[result] ?? 'bg-muted'}`}
        >
          {result}
        </span>
      ))}
    </div>
  );
}

export function MatchStats({
  homeStats,
  awayStats,
}: {
  homeStats: TeamMatchStats;
  awayStats: TeamMatchStats;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques (10 derniers matchs)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <FormBadges form={homeStats.form} />
          <span className="text-muted-foreground text-xs">Forme recente</span>
          <FormBadges form={awayStats.form} />
        </div>

        <div className="divide-border divide-y">
          {ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between py-2 text-sm">
              <span className="w-16 text-left font-medium">{homeStats[row.key]}</span>
              <span className="text-muted-foreground flex-1 text-center text-xs">{row.label}</span>
              <span className="w-16 text-right font-medium">{awayStats[row.key]}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="w-16 text-left font-medium">{homeStats.overRate ?? '-'}%</span>
            <span className="text-muted-foreground flex-1 text-center text-xs">Over 2.5 (saison)</span>
            <span className="w-16 text-right font-medium">{awayStats.overRate ?? '-'}%</span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="w-16 text-left font-medium">{homeStats.bttsRate ?? '-'}%</span>
            <span className="text-muted-foreground flex-1 text-center text-xs">BTTS (saison)</span>
            <span className="w-16 text-right font-medium">{awayStats.bttsRate ?? '-'}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
