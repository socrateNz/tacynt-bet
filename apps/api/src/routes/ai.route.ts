import { Router } from 'express';

import { aiController } from '../controllers/ai.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { aiRateLimiter } from '../middlewares/rate-limit.middleware';

export const aiRouter = Router();

aiRouter.use(requireAuth);
aiRouter.post('/matches/:id/analyze', aiRateLimiter, aiController.analyzeMatch);
aiRouter.get('/analyses/:id', aiController.getAnalysis);
