'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/auth-store';

export function SiteHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="border-border/60 border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href={ROUTES.home} className="text-lg font-semibold tracking-tight">
            Tacynt Bet
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            {user ? (
              <Link href={ROUTES.dashboard} className="text-muted-foreground hover:text-foreground">
                Tableau de bord
              </Link>
            ) : null}
            <Link href={ROUTES.matches} className="text-muted-foreground hover:text-foreground">
              Matchs
            </Link>
            <Link href={ROUTES.predictions} className="text-muted-foreground hover:text-foreground">
              Pronostics
            </Link>
            <Link href={ROUTES.coupons} className="text-muted-foreground hover:text-foreground">
              Coupons
            </Link>
            {user ? (
              <Link href={ROUTES.history} className="text-muted-foreground hover:text-foreground">
                Historique
              </Link>
            ) : null}
            {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
              <Link href={ROUTES.admin} className="text-muted-foreground hover:text-foreground">
                Administration
              </Link>
            ) : null}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Button variant="ghost" asChild>
              <Link href={ROUTES.profile}>{user.name}</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href={ROUTES.login}>Connexion</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.register}>Commencer gratuitement</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
