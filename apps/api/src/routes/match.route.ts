import { Router } from 'express';
import { matchQuerySchema } from '@tacynt/shared';

import { matchController } from '../controllers/match.controller';
import { optionalAuth } from '../middlewares/auth.middleware';
import { validateQuery } from '../middlewares/validate.middleware';

export const matchRouter = Router();

matchRouter.get('/', optionalAuth, validateQuery(matchQuerySchema), matchController.list);
matchRouter.get('/:id', optionalAuth, matchController.detail);
