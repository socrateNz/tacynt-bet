import type { UserRole } from '@tacynt/config';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
      /** Query params valides/coerces par validateQuery (req.query est en lecture seule sous Express 5). */
      validatedQuery?: unknown;
    }
  }
}

export {};
