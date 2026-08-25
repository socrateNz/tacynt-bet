import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';

import { AdminUsersContent } from './users-content';

export const metadata: Metadata = {
  title: 'Utilisateurs | Administration | Tacynt Bet',
};

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <AdminUsersContent />
    </div>
  );
}
