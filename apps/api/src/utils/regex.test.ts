import { describe, expect, it } from 'vitest';

import { escapeRegex } from './regex';

describe('escapeRegex', () => {
  it('escapes every regex metacharacter', () => {
    const raw = '.*+?^${}()|[]\\';
    const escaped = escapeRegex(raw);
    // The escaped string, compiled as a regex, must match only the literal original string.
    const pattern = new RegExp(`^${escaped}$`);
    expect(pattern.test(raw)).toBe(true);
  });

  it('a wildcard payload no longer matches everything', () => {
    const pattern = new RegExp(escapeRegex('.*'), 'i');
    expect(pattern.test('anything at all')).toBe(false);
    expect(pattern.test('literally .*')).toBe(true);
  });

  it('leaves plain alphanumeric search terms unaffected', () => {
    expect(escapeRegex('Phase16')).toBe('Phase16');
    const pattern = new RegExp(escapeRegex('Phase16'), 'i');
    expect(pattern.test('Phase16 Test')).toBe(true);
  });

  it('a catastrophic-backtracking-style payload is treated as a literal, not compiled as an engine trap', () => {
    const payload = '(a+)+$';
    const pattern = new RegExp(escapeRegex(payload), 'i');
    expect(pattern.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!')).toBe(false);
    expect(pattern.test(`literal ${payload} here`)).toBe(true);
  });
});
