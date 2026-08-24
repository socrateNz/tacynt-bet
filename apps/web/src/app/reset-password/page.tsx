import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AuthShell } from '@/features/auth/components/auth-shell';

import { ResetPasswordPageContent } from './reset-password-content';

export const metadata: Metadata = {
  title: 'Reinitialiser le mot de passe | Tacynt Bet',
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Reinitialiser le mot de passe"
      description="Choisissez un nouveau mot de passe."
    >
      <Suspense fallback={null}>
        <ResetPasswordPageContent />
      </Suspense>
    </AuthShell>
  );
}
