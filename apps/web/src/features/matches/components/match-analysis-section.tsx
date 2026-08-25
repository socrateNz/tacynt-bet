'use client';

import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { analysisErrorMessage, useAnalyzeMatch } from '@/hooks/use-ai-analysis';
import { useAuthStore } from '@/store/auth-store';

import { MatchAnalysisPanel } from './match-analysis-panel';

export function MatchAnalysisSection({ matchId }: { matchId: string }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken));
  const analyze = useAnalyzeMatch(matchId);

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.info('Connectez-vous pour utiliser Tacynt AI.');
      router.push(ROUTES.login);
      return;
    }

    analyze.mutate(undefined, {
      onError: (error) => {
        toast.error(analysisErrorMessage(error));
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Button size="lg" className="w-full" onClick={handleClick} disabled={analyze.isPending}>
          <Sparkles /> {analyze.isPending ? 'Analyse en cours...' : 'Analyser avec Tacynt AI'}
        </Button>
        <p className="text-muted-foreground text-center text-xs leading-relaxed">
          Les analyses et pronostics proposes par Tacynt Bet sont generes a partir de donnees
          statistiques et de modeles d&apos;intelligence artificielle. Ils ne constituent pas une
          garantie de resultat.
        </p>
      </div>

      {analyze.data ? <MatchAnalysisPanel analysis={analyze.data} /> : null}
    </div>
  );
}
