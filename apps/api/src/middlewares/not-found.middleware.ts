import type { Request, Response } from 'express';
import { ERROR_CODES } from '@tacynt/config';

export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: `Route ${req.method} ${req.originalUrl} introuvable.`,
    },
  });
}
