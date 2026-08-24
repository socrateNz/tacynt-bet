import Link from 'next/link';
import type { Metadata } from 'next';

import { AuthShell } from '@/features/auth/components/auth-shell';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Mot de passe oublie | Tacynt Bet',
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Mot de passe oublie"
      description="Recevez un lien pour choisir un nouveau mot de passe."
      footer={
        <Link href={ROUTES.login} className="text-foreground underline underline-offset-2">
          Retour a la connexion
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
