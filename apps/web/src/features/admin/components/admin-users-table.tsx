'use client';

import * as React from 'react';
import type { UserRole } from '@tacynt/config';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus } from '@/hooks/use-admin';
import { PLAN_LABELS, ROLE_LABELS } from '@/lib/betting-labels';
import { useAuthStore } from '@/store/auth-store';

const PAGE_SIZE = 20;
const ROLE_OPTIONS: UserRole[] = ['USER', 'ADMIN', 'SUPER_ADMIN'];

export function AdminUsersTable() {
  const currentUser = useAuthStore((state) => state.user);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const { data, isLoading } = useAdminUsers({ page, limit: PAGE_SIZE, search: search || undefined });
  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <Input
        placeholder="Rechercher par nom ou email..."
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Inscrit le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items.map((user) => {
            const isSelf = user.id === currentUser?.id;
            const canEditStatus = isSuperAdmin || user.role === 'USER';

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {isSuperAdmin && !isSelf ? (
                    <Select
                      value={user.role}
                      onValueChange={(role) => updateRole.mutate({ id: user.id, role: role as UserRole })}
                    >
                      <SelectTrigger size="sm" className="w-[190px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline">{ROLE_LABELS[user.role] ?? user.role}</Badge>
                  )}
                </TableCell>
                <TableCell>{PLAN_LABELS[user.plan] ?? user.plan}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'secondary' : 'destructive'}>
                    {user.isActive ? 'Actif' : 'Desactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">
                  {isSelf ? (
                    <span className="text-muted-foreground text-xs">Vous</span>
                  ) : canEditStatus ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updateStatus.isPending}
                      onClick={() => updateStatus.mutate({ id: user.id, isActive: !user.isActive })}
                    >
                      {user.isActive ? 'Desactiver' : 'Activer'}
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {data?.items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucun utilisateur trouve.</p>
      ) : null}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Precedent
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {page} / {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Suivant
          </Button>
        </div>
      ) : null}
    </div>
  );
}
