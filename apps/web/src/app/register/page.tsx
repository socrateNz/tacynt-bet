import Link from 'next/link';
import type { Metadata } from 'next';

import { AuthShell } from '@/features/auth/components/auth-shell';
import { RegisterForm } from '@/features/auth/components/register-form';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Creer un compte | Tacynt Bet',
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Creer un compte"
      description="Analysez les matchs et construisez vos coupons."
      footer={
        <>
          Deja un compte ?{' '}
          <Link href={ROUTES.login} className="text-foreground underline underline-offset-2">
            Se connecter
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
