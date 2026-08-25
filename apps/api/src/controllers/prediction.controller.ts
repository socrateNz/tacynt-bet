import type { Request, Response } from 'express';
import type { PredictionQueryInput } from '@tacynt/shared';

import { predictionService } from '../services/prediction.service';
import { sendSuccess } from '../utils/api-response';

export const predictionController = {
  async list(req: Request, res: Response) {
    const query = req.validatedQuery as PredictionQueryInput;
    const result = await predictionService.list(query);
    sendSuccess(res, result);
  },

  async detail(req: Request, res: Response) {
    const prediction = await predictionService.getById(req.params.id as string);
    sendSuccess(res, prediction);
  },
};
