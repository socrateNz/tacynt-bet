import { Router } from 'express';
import { adminUsersQuerySchema, updateUserRoleSchema, updateUserStatusSchema } from '@tacynt/shared';

import { adminController } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validateBody, validateQuery } from '../middlewares/validate.middleware';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'));

adminRouter.get('/overview', adminController.overview);
adminRouter.get('/users', validateQuery(adminUsersQuerySchema), adminController.listUsers);
adminRouter.patch('/users/:id/role', requireRole('SUPER_ADMIN'), validateBody(updateUserRoleSchema), adminController.updateUserRole);
adminRouter.patch('/users/:id/status', validateBody(updateUserStatusSchema), adminController.updateUserStatus);
adminRouter.post('/matches/sync', adminController.syncMatches);
adminRouter.get('/ai-usage', adminController.aiUsage);
adminRouter.get('/analytics', adminController.analytics);
