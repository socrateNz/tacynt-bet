export interface PerformanceBreakdown {
  key: string;
  /** Cle brute (nom de sport, ou valeur d'enum market/risk) - le frontend applique sa propre traduction. */
  label: string;
  total: number;
  won: number;
  lost: number;
  /** null si aucun pronostic regle (won+lost = 0) dans ce groupe. */
  successRate: number | null;
}

export interface HistoryStats {
  totalPredictions: number;
  settledPredictions: number;
  wonPredictions: number;
  lostPredictions: number;
  voidPredictions: number;
  pendingPredictions: number;
  successRate: number | null;
  performanceBySport: PerformanceBreakdown[];
  performanceByMarket: PerformanceBreakdown[];
  performanceByRisk: PerformanceBreakdown[];
}
