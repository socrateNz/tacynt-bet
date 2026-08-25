'use client';

import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdminAiUsage } from '@/hooks/use-admin';
import { AI_OPERATION_LABELS } from '@/lib/betting-labels';
import { CircleDollarSign, Hash, Layers } from 'lucide-react';

export function AiUsageBreakdown() {
  const { data, isLoading } = useAdminAiUsage();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Appels IA au total" value={data?.totalCalls ?? 0} icon={Hash} />
        <StatCard
          label="Tokens (in / out)"
          value={`${(data?.totalTokensInput ?? 0).toLocaleString('fr-FR')} / ${(data?.totalTokensOutput ?? 0).toLocaleString('fr-FR')}`}
          icon={Layers}
        />
        <StatCard label="Cout total" value={`$${(data?.totalCost ?? 0).toFixed(4)}`} icon={CircleDollarSign} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repartition par operation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operation</TableHead>
                <TableHead>Appels</TableHead>
                <TableHead>Tokens entree</TableHead>
                <TableHead>Tokens sortie</TableHead>
                <TableHead>Cout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.byOperation.map((entry) => (
                <TableRow key={entry.operation}>
                  <TableCell className="font-medium">
                    {AI_OPERATION_LABELS[entry.operation] ?? entry.operation}
                  </TableCell>
                  <TableCell>{entry.count}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.tokensInput.toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.tokensOutput.toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell>${entry.cost.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data?.byOperation.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-sm">Aucun appel IA enregistre pour le moment.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
