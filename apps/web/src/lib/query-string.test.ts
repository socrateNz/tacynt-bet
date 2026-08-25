import { describe, expect, it } from 'vitest';

import { toQueryString } from './query-string';

describe('toQueryString', () => {
  it('returns an empty string when there is nothing to serialize', () => {
    expect(toQueryString({})).toBe('');
  });

  it('omits undefined, null, and empty-string values', () => {
    expect(toQueryString({ a: undefined, b: null, c: '', d: 'kept' })).toBe('?d=kept');
  });

  it('serializes multiple values, including numbers and booleans', () => {
    const result = toQueryString({ page: 2, limit: 10, favoritesOnly: true });
    const params = new URLSearchParams(result.slice(1));
    expect(params.get('page')).toBe('2');
    expect(params.get('limit')).toBe('10');
    expect(params.get('favoritesOnly')).toBe('true');
  });

  it('keeps the value 0 (falsy but meaningful)', () => {
    expect(toQueryString({ page: 0 })).toBe('?page=0');
  });
});
