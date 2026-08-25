import { Router } from 'express';
import { historyAnalysesQuerySchema } from '@tacynt/shared';

import { historyController } from '../controllers/history.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateQuery } from '../middlewares/validate.middleware';

export const historyRouter = Router();

historyRouter.use(requireAuth);
historyRouter.get('/stats', historyController.stats);
historyRouter.get('/analyses', validateQuery(historyAnalysesQuerySchema), historyController.analyses);
