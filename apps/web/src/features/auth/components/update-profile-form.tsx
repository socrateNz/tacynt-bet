'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateProfileSchema, type UpdateProfileInput, type UserProfile } from '@tacynt/shared';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUpdateProfile } from '@/hooks/use-auth';

export function UpdateProfileForm({ user }: { user: UserProfile }) {
  const updateProfile = useUpdateProfile();
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </form>
    </Form>
  );
}
