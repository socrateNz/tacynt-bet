import { describe, expect, it } from 'vitest';

import { evaluateSelection } from './prediction-result.service';

describe('evaluateSelection', () => {
  describe('MATCH_WINNER', () => {
    it('resolves HOME/DRAW/AWAY correctly', () => {
      expect(evaluateSelection('MATCH_WINNER', 'HOME', { home: 2, away: 0 })).toBe('WON');
      expect(evaluateSelection('MATCH_WINNER', 'AWAY', { home: 2, away: 0 })).toBe('LOST');
      expect(evaluateSelection('MATCH_WINNER', 'DRAW', { home: 1, away: 1 })).toBe('WON');
      expect(evaluateSelection('MATCH_WINNER', 'HOME', { home: 1, away: 1 })).toBe('LOST');
    });
  });

  describe('DOUBLE_CHANCE', () => {
    it('HOME_OR_DRAW wins unless away wins outright', () => {
      expect(evaluateSelection('DOUBLE_CHANCE', 'HOME_OR_DRAW', { home: 1, away: 0 })).toBe('WON');
      expect(evaluateSelection('DOUBLE_CHANCE', 'HOME_OR_DRAW', { home: 1, away: 1 })).toBe('WON');
      expect(evaluateSelection('DOUBLE_CHANCE', 'HOME_OR_DRAW', { home: 0, away: 1 })).toBe('LOST');
    });

    it('DRAW_OR_AWAY wins unless home wins outright', () => {
      expect(evaluateSelection('DOUBLE_CHANCE', 'DRAW_OR_AWAY', { home: 0, away: 1 })).toBe('WON');
      expect(evaluateSelection('DOUBLE_CHANCE', 'DRAW_OR_AWAY', { home: 1, away: 1 })).toBe('WON');
      expect(evaluateSelection('DOUBLE_CHANCE', 'DRAW_OR_AWAY', { home: 1, away: 0 })).toBe('LOST');
    });

    it('HOME_OR_AWAY wins unless it is a draw', () => {
      expect(evaluateSelection('DOUBLE_CHANCE', 'HOME_OR_AWAY', { home: 2, away: 1 })).toBe('WON');
      expect(evaluateSelection('DOUBLE_CHANCE', 'HOME_OR_AWAY', { home: 1, away: 1 })).toBe('LOST');
    });

    it('returns VOID for an unrecognized selection', () => {
      expect(evaluateSelection('DOUBLE_CHANCE', 'BOGUS', { home: 1, away: 1 })).toBe('VOID');
    });
  });

  describe('DRAW_NO_BET', () => {
    it('voids on a draw and settles WON/LOST otherwise', () => {
      expect(evaluateSelection('DRAW_NO_BET', 'HOME', { home: 1, away: 1 })).toBe('VOID');
      expect(evaluateSelection('DRAW_NO_BET', 'HOME', { home: 2, away: 1 })).toBe('WON');
      expect(evaluateSelection('DRAW_NO_BET', 'AWAY', { home: 2, away: 1 })).toBe('LOST');
    });
  });

  describe('OVER_UNDER', () => {
    it('OVER_2_5 wins when total goals exceed 2.5', () => {
      expect(evaluateSelection('OVER_UNDER', 'OVER_2_5', { home: 2, away: 1 })).toBe('WON');
      expect(evaluateSelection('OVER_UNDER', 'OVER_2_5', { home: 1, away: 1 })).toBe('LOST');
    });

    it('UNDER_2_5 wins when total goals are below 2.5', () => {
      expect(evaluateSelection('OVER_UNDER', 'UNDER_2_5', { home: 1, away: 1 })).toBe('WON');
      expect(evaluateSelection('OVER_UNDER', 'UNDER_2_5', { home: 2, away: 1 })).toBe('LOST');
    });
  });

  describe('BTTS', () => {
    it('YES wins only when both teams score', () => {
      expect(evaluateSelection('BTTS', 'YES', { home: 1, away: 1 })).toBe('WON');
      expect(evaluateSelection('BTTS', 'YES', { home: 1, away: 0 })).toBe('LOST');
    });

    it('NO wins only when at least one team fails to score', () => {
      expect(evaluateSelection('BTTS', 'NO', { home: 1, away: 0 })).toBe('WON');
      expect(evaluateSelection('BTTS', 'NO', { home: 1, away: 1 })).toBe('LOST');
    });
  });

  describe('unstructured markets', () => {
    it('never invents a rule for HANDICAP/CORRECT_SCORE/unknown markets - always VOID', () => {
      expect(evaluateSelection('HANDICAP', '-1', { home: 2, away: 0 })).toBe('VOID');
      expect(evaluateSelection('CORRECT_SCORE', '2-0', { home: 2, away: 0 })).toBe('VOID');
      expect(evaluateSelection('SOMETHING_UNKNOWN', 'X', { home: 2, away: 0 })).toBe('VOID');
    });
  });
});
