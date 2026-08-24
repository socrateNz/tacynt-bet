import Link from 'next/link';
import type { Metadata } from 'next';

import { AuthShell } from '@/features/auth/components/auth-shell';
import { LoginForm } from '@/features/auth/components/login-form';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Connexion | Tacynt Bet',
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Connexion"
      description="Accedez a vos analyses et coupons."
      footer={
        <>
          Pas encore de compte ?{' '}
          <Link href={ROUTES.register} className="text-foreground underline underline-offset-2">
            Creer un compte
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
