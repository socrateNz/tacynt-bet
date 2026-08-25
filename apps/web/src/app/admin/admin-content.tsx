'use client';

import { AdminGuard } from '@/features/admin/components/admin-guard';
import { AdminNav } from '@/features/admin/components/admin-nav';
import { AdminOverviewStats } from '@/features/admin/components/admin-overview-stats';

function AdminOverviewBody() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Administration</h1>
        <p className="text-muted-foreground text-sm">Vue d&apos;ensemble de la plateforme Tacynt Bet.</p>
      </div>

      <AdminNav />

      <AdminOverviewStats />
    </div>
  );
}

export function AdminOverviewContent() {
  return (
    <AdminGuard>
      <AdminOverviewBody />
    </AdminGuard>
  );
}
