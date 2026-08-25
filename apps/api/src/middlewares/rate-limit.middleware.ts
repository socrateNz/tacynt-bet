import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';
import { ERROR_CODES } from '@tacynt/config';

function rateLimitedHandler(_req: Request, res: Response) {
  res.status(429).json({
    success: false,
    error: {
      code: ERROR_CODES.RATE_LIMITED,
      message: 'Trop de requetes, reessayez plus tard.',
    },
  });
}

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitedHandler,
});

/** Limite stricte pour les endpoints sensibles (login/register/forgot-password) - anti brute-force. */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitedHandler,
});

/** Limite les appels IA par IP, en complement de la limite quotidienne par utilisateur/plan. */
export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitedHandler,
});
