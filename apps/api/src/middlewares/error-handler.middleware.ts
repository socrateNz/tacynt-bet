import type { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import { ERROR_CODES } from '@tacynt/config';

import { logger } from '../config/logger';
import { AppError } from '../utils/errors';

// L'arite a 4 parametres est requise par Express pour reconnaitre ce middleware comme un error handler.
export function errorHandlerMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err }, err.message);
    }
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
    return;
  }

  if (err instanceof MongooseError.CastError) {
    res.status(400).json({
      success: false,
      error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Identifiant invalide.' },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: err.issues.map((issue) => issue.message).join(', '),
      },
    });
    return;
  }

  logger.error({ err }, 'Erreur non geree');
  res.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Une erreur inattendue est survenue.',
    },
  });
}
