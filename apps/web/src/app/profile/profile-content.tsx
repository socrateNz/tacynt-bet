'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';
import { UpdateProfileForm } from '@/features/auth/components/update-profile-form';
import { useLogout, useMe } from '@/hooks/use-auth';

function ProfileDetails() {
  const { data: user, isLoading } = useMe();
  const logout = useLogout();

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-6 py-16">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
        <Badge variant="outline">{user.plan}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Mettez a jour votre nom.</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateProfileForm user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mot de passe</CardTitle>
          <CardDescription>Changez votre mot de passe regulierement.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Separator />

      <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
        Se deconnecter
      </Button>
    </div>
  );
}

export function ProfilePageContent() {
  return (
    <AuthGuard>
      <ProfileDetails />
    </AuthGuard>
  );
}
