import { Router } from 'express';

import { dashboardController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middlewares/auth.middleware';

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get('/stats', dashboardController.stats);
dashboardRouter.get('/recent-analyses', dashboardController.recentAnalyses);
