import Link from 'next/link';
import type { ReactNode } from 'react';

import { ROUTES } from '@/constants/routes';

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link
          href={ROUTES.home}
          className="mb-8 block text-center text-lg font-semibold tracking-tight"
        >
          Tacynt Bet
        </Link>
        <div className="bg-card rounded-xl border p-8">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description ? (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? <p className="text-muted-foreground mt-6 text-center text-sm">{footer}</p> : null}
      </div>
    </div>
  );
}
