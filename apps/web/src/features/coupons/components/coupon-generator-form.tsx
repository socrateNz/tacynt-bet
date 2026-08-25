'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { generateCouponsSchema, type Coupon } from '@tacynt/shared';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ApiRequestError } from '@/services/api-client';
import { useGenerateCoupons } from '@/hooks/use-coupons';
import { useRiskProfileStore } from '@/store/risk-profile-store';

import { RiskProfilePicker } from './risk-profile-picker';

const LOADING_MESSAGES = [
  'Analyse des matchs...',
  'Evaluation des probabilites...',
  'Construction des combinaisons...',
  'Optimisation des coupons...',
];

function useLoadingMessage(isActive: boolean): string {
  const [index, setIndex] = React.useState(0);
  const [wasActive, setWasActive] = React.useState(isActive);

  if (isActive !== wasActive) {
    setWasActive(isActive);
    if (!isActive) {
      setIndex(0);
    }
  }

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    const interval = setInterval(() => {
      setIndex((current) => Math.min(current + 1, LOADING_MESSAGES.length - 1));
    }, 900);

    return () => clearInterval(interval);
  }, [isActive]);

  return LOADING_MESSAGES[index] as string;
}

export function CouponGeneratorForm({
  onGenerated,
}: {
  onGenerated: (coupons: Coupon[], targetOdds: number) => void;
}) {
  const generate = useGenerateCoupons();
  const riskProfile = useRiskProfileStore((state) => state.riskProfile);
  const setRiskProfile = useRiskProfileStore((state) => state.setRiskProfile);
  const loadingMessage = useLoadingMessage(generate.isPending);

  const form = useForm({
    resolver: zodResolver(generateCouponsSchema),
    defaultValues: { targetOdds: 10, numberOfCoupons: 5, riskProfile },
  });

  const onSubmit = form.handleSubmit((values) => {
    setRiskProfile(values.riskProfile);
    generate.mutate(values, {
      onSuccess: (coupons) => onGenerated(coupons, values.targetOdds),
      onError: (error) => {
        toast.error(
          error instanceof ApiRequestError
            ? error.message
            : 'La generation a echoue. Reessayez dans quelques instants.',
        );
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Etape 1</p>
          <FormField
            control={form.control}
            name="targetOdds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cote souhaitee</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="1.01" {...field} value={field.value as number} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Etape 2</p>
          <FormField
            control={form.control}
            name="numberOfCoupons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Combien de coupons ?</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="10" {...field} value={field.value as number} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Etape 3</p>
          <FormField
            control={form.control}
            name="riskProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Votre profil</FormLabel>
                <FormControl>
                  <RiskProfilePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={generate.isPending}>
          {generate.isPending ? loadingMessage : 'Analyser'}
        </Button>
      </form>
    </Form>
  );
}
