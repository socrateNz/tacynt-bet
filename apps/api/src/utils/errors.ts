import { ERROR_CODES, type ErrorCode } from '@tacynt/config';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;

  constructor(code: ErrorCode, message: string, statusCode: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }

  static validation(message: string) {
    return new AppError(ERROR_CODES.VALIDATION_ERROR, message, 400);
  }

  static unauthorized(message = 'Authentification requise.') {
    return new AppError(ERROR_CODES.UNAUTHORIZED, message, 401);
  }

  static forbidden(message = 'Acces refuse.') {
    return new AppError(ERROR_CODES.FORBIDDEN, message, 403);
  }

  static notFound(message = 'Ressource introuvable.') {
    return new AppError(ERROR_CODES.NOT_FOUND, message, 404);
  }

  static conflict(message: string) {
    return new AppError(ERROR_CODES.CONFLICT, message, 409);
  }

  static rateLimited(message = 'Trop de requetes, reessayez plus tard.') {
    return new AppError(ERROR_CODES.RATE_LIMITED, message, 429);
  }

  static aiService(message: string) {
    return new AppError(ERROR_CODES.AI_SERVICE_ERROR, message, 502);
  }

  static internal(message = 'Une erreur inattendue est survenue.') {
    return new AppError(ERROR_CODES.INTERNAL_ERROR, message, 500);
  }
}
