import type { Response } from 'express';
import type { ApiSuccessResponse } from '@tacynt/shared';

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
): Response<ApiSuccessResponse<T>> {
  return res.status(statusCode).json({ success: true, data });
}
