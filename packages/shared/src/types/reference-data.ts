import type { CompetitionRef, SportRef } from './match';

export interface CompetitionOption extends CompetitionRef {
  sport: SportRef;
}
