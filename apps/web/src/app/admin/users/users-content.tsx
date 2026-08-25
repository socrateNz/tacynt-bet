'use client';

import { AdminGuard } from '@/features/admin/components/admin-guard';
import { AdminNav } from '@/features/admin/components/admin-nav';
import { AdminUsersTable } from '@/features/admin/components/admin-users-table';

function AdminUsersBody() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Utilisateurs</h1>
        <p className="text-muted-foreground text-sm">Gestion des comptes, roles et acces.</p>
      </div>

      <AdminNav />

      <AdminUsersTable />
    </div>
  );
}

export function AdminUsersContent() {
  return (
    <AdminGuard>
      <AdminUsersBody />
    </AdminGuard>
  );
}
