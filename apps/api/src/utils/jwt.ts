import jwt from 'jsonwebtoken';
import type { UserRole } from '@tacynt/config';

import { env } from '../config/env';

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}

const JWT_ALGORITHM = 'HS256' as const;

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: [JWT_ALGORITHM] }) as AccessTokenPayload;
}
