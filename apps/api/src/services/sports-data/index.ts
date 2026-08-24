import { MockSportsDataProvider } from './mock-provider';
import type { SportsDataProvider } from './types';

export * from './types';

/**
 * Point d'entree unique vers les donnees sportives. Remplacer cette ligne par un fournisseur
 * reel (API-Football, Sportmonks, ...) plus tard, sans toucher aux consommateurs.
 */
export const sportsDataService: SportsDataProvider = new MockSportsDataProvider();
