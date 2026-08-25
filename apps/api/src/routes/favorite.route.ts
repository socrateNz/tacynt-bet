import { Router } from 'express';
import { createFavoriteSchema } from '@tacynt/shared';

import { favoriteController } from '../controllers/favorite.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';

export const favoriteRouter = Router();

favoriteRouter.use(requireAuth);
favoriteRouter.get('/', favoriteController.list);
favoriteRouter.post('/', validateBody(createFavoriteSchema), favoriteController.create);
favoriteRouter.delete('/:id', favoriteController.remove);
