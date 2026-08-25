import type { Metadata } from 'next';

import { SiteHeader } from '@/components/layout/site-header';
import { PredictionList } from '@/features/predictions/components/prediction-list';

export const metadata: Metadata = {
  title: 'Pronostics | Tacynt Bet',
};

export default function PredictionsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-12">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pronostics</h1>
          <p className="text-muted-foreground text-sm">
            Explorez les pronostics generes par Tacynt AI sur les matchs analyses.
          </p>
        </div>
        <PredictionList />
        <p className="text-muted-foreground border-border border-t pt-6 text-center text-xs leading-relaxed">
          Les analyses et pronostics proposes par Tacynt Bet sont generes a partir de donnees
          statistiques et de modeles d&apos;intelligence artificielle. Ils ne constituent pas une
          garantie de resultat.
        </p>
      </div>
    </div>
  );
}
