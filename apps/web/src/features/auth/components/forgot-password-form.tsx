'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@tacynt/shared';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForgotPassword } from '@/hooks/use-auth';

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  if (forgotPassword.isSuccess) {
    return (
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">{forgotPassword.data.message}</p>
        {forgotPassword.data.devToken ? (
          <div className="border-border bg-muted/40 rounded-md border p-3">
            <p className="text-muted-foreground mb-2 text-xs">
              Mode developpement (aucun service d&apos;email configure) :
            </p>
            <Link
              href={`/reset-password?token=${forgotPassword.data.devToken}`}
              className="text-primary text-xs underline underline-offset-2"
            >
              Ouvrir le lien de reinitialisation
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => forgotPassword.mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="vous@exemple.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
          {forgotPassword.isPending ? 'Envoi...' : 'Envoyer le lien de reinitialisation'}
        </Button>
      </form>
    </Form>
  );
}
