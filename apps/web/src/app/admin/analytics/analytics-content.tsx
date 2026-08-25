'use client';

import { AdminGuard } from '@/features/admin/components/admin-guard';
import { AdminNav } from '@/features/admin/components/admin-nav';
import { AnalyticsCharts } from '@/features/admin/components/analytics-charts';

function AdminAnalyticsBody() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytique</h1>
        <p className="text-muted-foreground text-sm">Tendances d&apos;utilisation et de performance globale.</p>
      </div>

      <AdminNav />

      <AnalyticsCharts />
    </div>
  );
}

export function AdminAnalyticsContent() {
  return (
    <AdminGuard>
      <AdminAnalyticsBody />
    </AdminGuard>
  );
}
