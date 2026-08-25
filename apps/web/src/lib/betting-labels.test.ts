import { AI_OPERATIONS, MARKET_TYPES, RISK_LEVELS, USER_PLANS, USER_ROLES } from '@tacynt/config';
import { describe, expect, it } from 'vitest';

import { AI_OPERATION_LABELS, MARKET_LABELS, PLAN_LABELS, RISK_LABELS, ROLE_LABELS } from './betting-labels';

describe('label dictionaries stay in sync with their enums', () => {
  it('MARKET_LABELS covers every MARKET_TYPES value', () => {
    for (const market of MARKET_TYPES) {
      expect(MARKET_LABELS[market], `missing label for market "${market}"`).toBeTypeOf('string');
    }
  });

  it('RISK_LABELS covers every RISK_LEVELS value', () => {
    for (const risk of RISK_LEVELS) {
      expect(RISK_LABELS[risk], `missing label for risk "${risk}"`).toBeTypeOf('string');
    }
  });

  it('ROLE_LABELS covers every USER_ROLES value', () => {
    for (const role of USER_ROLES) {
      expect(ROLE_LABELS[role], `missing label for role "${role}"`).toBeTypeOf('string');
    }
  });

  it('PLAN_LABELS covers every USER_PLANS value', () => {
    for (const plan of USER_PLANS) {
      expect(PLAN_LABELS[plan], `missing label for plan "${plan}"`).toBeTypeOf('string');
    }
  });

  it('AI_OPERATION_LABELS covers every AI_OPERATIONS value', () => {
    for (const operation of AI_OPERATIONS) {
      expect(AI_OPERATION_LABELS[operation], `missing label for AI operation "${operation}"`).toBeTypeOf('string');
    }
  });
});
