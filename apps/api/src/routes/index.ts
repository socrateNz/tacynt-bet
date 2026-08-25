import { Router } from 'express';

import { healthRouter } from './health.route';
import { authRouter } from './auth.route';
import { matchRouter } from './match.route';
import { favoriteRouter } from './favorite.route';
import { competitionRouter } from './competition.route';
import { aiRouter } from './ai.route';
import { predictionRouter } from './prediction.route';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/matches', matchRouter);
apiRouter.use('/favorites', favoriteRouter);
apiRouter.use('/competitions', competitionRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/predictions', predictionRouter);
