'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAiUsage } from '@/hooks/use-admin';

export function AiUsageChart() {
  const { data, isLoading } = useAdminAiUsage();

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cout IA par jour (30 derniers jours)</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data?.byDay ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickFormatter={(value: number) => `$${value.toFixed(4)}`}
              width={70}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Cout']}
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}
            />
            <Line type="monotone" dataKey="cost" stroke="var(--primary)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
