'use client';

import { AdminGuard } from '@/features/admin/components/admin-guard';
import { AdminMatchesTable } from '@/features/admin/components/admin-matches-table';
import { AdminNav } from '@/features/admin/components/admin-nav';

function AdminMatchesBody() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Matchs</h1>
        <p className="text-muted-foreground text-sm">
          Suivi des matchs synchronises et declenchement manuel de la synchronisation.
        </p>
      </div>

      <AdminNav />

      <AdminMatchesTable />
    </div>
  );
}

export function AdminMatchesContent() {
  return (
    <AdminGuard>
      <AdminMatchesBody />
    </AdminGuard>
  );
}
