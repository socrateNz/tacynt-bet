import Link from 'next/link';
import { ChartNoAxesCombined, Sparkles, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/constants/routes';

const STEPS = [
  {
    icon: ChartNoAxesCombined,
    title: 'Analysez les matchs',
    description:
      'Statistiques, forme recente, confrontations directes et absences pour chaque rencontre.',
  },
  {
    icon: Sparkles,
    title: "Laissez l'IA analyser",
    description:
      "Tacynt AI examine les donnees disponibles et produit une analyse structuree, jamais inventee.",
  },
  {
    icon: Target,
    title: 'Construisez vos coupons',
    description:
      'Choisissez une cote cible et un profil de risque : obtenez plusieurs coupons proches de votre objectif.',
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border/60 border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-lg font-semibold tracking-tight">Tacynt Bet</span>
          <nav className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.login}>Connexion</Link>
            </Button>
            <Button asChild>
              <Link href={ROUTES.register}>Commencer gratuitement</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-24 text-center">
          <Badge variant="outline" className="text-muted-foreground mb-6">
            Analyse sportive assistee par IA
          </Badge>
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            Tacynt Bet
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg text-balance">
            Analysez les matchs. Comprenez les statistiques. Construisez vos coupons.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={ROUTES.register}>Commencer gratuitement</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={ROUTES.matches}>Voir les matchs</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <Card key={step.title}>
                <CardHeader>
                  <step.icon className="text-primary size-6" />
                  <CardTitle className="mt-3">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-border/60 border-t">
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <Separator className="mb-6" />
          <p className="text-muted-foreground text-xs leading-relaxed">
            Les analyses et pronostics proposes par Tacynt Bet sont generes a partir de donnees
            statistiques et de modeles d&apos;intelligence artificielle. Ils ne constituent pas
            une garantie de resultat. Les evenements sportifs restent imprevisibles.
          </p>
        </div>
      </footer>
    </div>
  );
}
