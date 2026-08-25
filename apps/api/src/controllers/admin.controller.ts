import type { Request, Response } from 'express';
import type { AdminUsersQueryInput, UpdateUserRoleInput, UpdateUserStatusInput } from '@tacynt/shared';

import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/api-response';

export const adminController = {
  async overview(_req: Request, res: Response) {
    const stats = await adminService.getOverview();
    sendSuccess(res, stats);
  },

  async listUsers(req: Request, res: Response) {
    const query = req.validatedQuery as AdminUsersQueryInput;
    const result = await adminService.listUsers(query.search, query.page, query.limit);
    sendSuccess(res, result);
  },

  async updateUserRole(req: Request, res: Response) {
    const { role } = req.body as UpdateUserRoleInput;
    const user = await adminService.updateUserRole(req.user!.id, req.params.id as string, role);
    sendSuccess(res, user);
  },

  async updateUserStatus(req: Request, res: Response) {
    const { isActive } = req.body as UpdateUserStatusInput;
    const user = await adminService.updateUserStatus(req.user!.id, req.user!.role, req.params.id as string, isActive);
    sendSuccess(res, user);
  },

  async syncMatches(_req: Request, res: Response) {
    const result = await adminService.syncMatches();
    sendSuccess(res, result);
  },

  async aiUsage(_req: Request, res: Response) {
    const stats = await adminService.getAiUsage();
    sendSuccess(res, stats);
  },

  async analytics(_req: Request, res: Response) {
    const stats = await adminService.getAnalytics();
    sendSuccess(res, stats);
  },
};
