import type { Absence } from '@tacynt/shared';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TYPE_LABELS: Record<Absence['type'], string> = {
  INJURY: 'Blessure',
  SUSPENSION: 'Suspension',
  OTHER: 'Incertain',
};

export function MatchAbsences({
  homeAbsences,
  awayAbsences,
  homeTeamName,
  awayTeamName,
}: {
  homeAbsences: Absence[];
  awayAbsences: Absence[];
  homeTeamName: string;
  awayTeamName: string;
}) {
  if (homeAbsences.length === 0 && awayAbsences.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Absences</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <AbsenceList title={homeTeamName} absences={homeAbsences} />
        <AbsenceList title={awayTeamName} absences={awayAbsences} />
      </CardContent>
    </Card>
  );
}

function AbsenceList({ title, absences }: { title: string; absences: Absence[] }) {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs font-medium">{title}</p>
      {absences.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune absence signalee.</p>
      ) : (
        <ul className="space-y-2">
          {absences.map((absence, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <span>{absence.player}</span>
              <Badge variant="outline">{TYPE_LABELS[absence.type]}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
