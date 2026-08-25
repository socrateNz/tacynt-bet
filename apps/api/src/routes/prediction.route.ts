import { Router } from 'express';
import { predictionQuerySchema } from '@tacynt/shared';

import { predictionController } from '../controllers/prediction.controller';
import { validateQuery } from '../middlewares/validate.middleware';

export const predictionRouter = Router();

predictionRouter.get('/', validateQuery(predictionQuerySchema), predictionController.list);
predictionRouter.get('/:id', predictionController.detail);
