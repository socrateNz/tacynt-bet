import { Router } from 'express';
import { couponQuerySchema, generateCouponsSchema } from '@tacynt/shared';

import { couponController } from '../controllers/coupon.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody, validateQuery } from '../middlewares/validate.middleware';

export const couponRouter = Router();

couponRouter.use(requireAuth);
couponRouter.post('/generate', validateBody(generateCouponsSchema), couponController.generate);
couponRouter.get('/', validateQuery(couponQuerySchema), couponController.list);
couponRouter.get('/:id', couponController.detail);
couponRouter.post('/:id/save', couponController.save);
couponRouter.delete('/:id', couponController.remove);
