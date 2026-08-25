import { describe, expect, it } from 'vitest';

import { compareAgainstDummyHash, comparePassword, hashPassword } from './password';

describe('hashPassword / comparePassword', () => {
  it('hashes a password and verifies it correctly', async () => {
    const hash = await hashPassword('CorrectHorseBattery1');
    expect(hash).not.toBe('CorrectHorseBattery1');
    expect(await comparePassword('CorrectHorseBattery1', hash)).toBe(true);
  });

  it('rejects an incorrect password against a real hash', async () => {
    const hash = await hashPassword('CorrectHorseBattery1');
    expect(await comparePassword('WrongPassword', hash)).toBe(false);
  });

  it('produces a different hash each time (random salt)', async () => {
    const hashA = await hashPassword('SamePassword1');
    const hashB = await hashPassword('SamePassword1');
    expect(hashA).not.toBe(hashB);
  });
});

describe('compareAgainstDummyHash', () => {
  it('always resolves to false without throwing, regardless of input', async () => {
    await expect(compareAgainstDummyHash('anything')).resolves.toBe(false);
    await expect(compareAgainstDummyHash('')).resolves.toBe(false);
  });
});
