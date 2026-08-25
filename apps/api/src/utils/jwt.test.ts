import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';

import { env } from '../config/env';
import { signAccessToken, verifyAccessToken } from './jwt';

describe('signAccessToken / verifyAccessToken', () => {
  it('round-trips a payload', () => {
    const token = signAccessToken({ sub: 'user-123', role: 'USER' });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe('user-123');
    expect(payload.role).toBe('USER');
  });

  it('rejects a token signed with a different secret', () => {
    const forged = jwt.sign({ sub: 'attacker', role: 'SUPER_ADMIN' }, 'a-completely-different-secret-value', {
      algorithm: 'HS256',
    });
    expect(() => verifyAccessToken(forged)).toThrow();
  });

  it('rejects a token signed with a different algorithm (algorithm confusion)', () => {
    // none-algorithm tokens are structurally rejected by jsonwebtoken regardless of pinning,
    // but this proves the explicit algorithms allowlist rejects anything but HS256 too.
    const differentAlgToken = jwt.sign({ sub: 'user-123', role: 'USER' }, env.JWT_SECRET, {
      algorithm: 'HS384',
    });
    expect(() => verifyAccessToken(differentAlgToken)).toThrow();
  });

  it('rejects a malformed token', () => {
    expect(() => verifyAccessToken('not-a-real-token')).toThrow();
  });
});
