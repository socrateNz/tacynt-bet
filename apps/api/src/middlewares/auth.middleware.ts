import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '@tacynt/config';

import { User } from '../models';
import { AppError } from '../utils/errors';
import { verifyAccessToken } from '../utils/jwt';

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(AppError.unauthorized());
  }

  try {
    const payload = verifyAccessToken(header.slice('Bearer '.length));
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      return next(AppError.unauthorized());
    }

    req.user = { id: user.id, email: user.email, role: user.role as UserRole };
    next();
  } catch {
    next(AppError.unauthorized('Session invalide ou expiree.'));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(AppError.forbidden());
    }
    next();
  };
}
