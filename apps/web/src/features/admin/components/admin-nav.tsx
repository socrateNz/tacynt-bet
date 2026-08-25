'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

const LINKS = [
  { href: ROUTES.admin, label: "Vue d'ensemble" },
  { href: ROUTES.adminUsers, label: 'Utilisateurs' },
  { href: ROUTES.adminMatches, label: 'Matchs' },
  { href: ROUTES.adminAiUsage, label: 'Usage IA' },
  { href: ROUTES.adminAnalytics, label: 'Analytique' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b pb-4">
      {LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
