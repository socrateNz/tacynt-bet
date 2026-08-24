import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '@tacynt/config';

import { User } from '../models';
import { AppError } from '../utils/errors';
import { verifyAccessToken } from '../utils/jwt';

async function resolveUserFromHeader(authorizationHeader?: string) {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const payload = verifyAccessToken(authorizationHeader.slice('Bearer '.length));
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      return null;
    }

    return { id: user.id, email: user.email, role: user.role as UserRole };
  } catch {
    return null;
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authUser = await resolveUserFromHeader(req.headers.authorization);

  if (!authUser) {
    return next(AppError.unauthorized('Session invalide ou expiree.'));
  }

  req.user = authUser;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(AppError.forbidden());
    }
    next();
  };
}

/** Renseigne req.user si un token valide est present, sans jamais rejeter la requete. */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authUser = await resolveUserFromHeader(req.headers.authorization);

  if (authUser) {
    req.user = authUser;
  }

  next();
}
