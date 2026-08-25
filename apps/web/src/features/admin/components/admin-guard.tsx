'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/auth-store';

function AdminRoleCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  React.useEffect(() => {
    if (user && !isAdmin) {
      router.replace(ROUTES.dashboard);
    }
  }, [user, isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminRoleCheck>{children}</AdminRoleCheck>
    </AuthGuard>
  );
}
