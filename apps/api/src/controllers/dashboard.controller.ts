import type { Request, Response } from 'express';

import { dashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/api-response';

export const dashboardController = {
  async stats(req: Request, res: Response) {
    const stats = await dashboardService.getStats(req.user!.id);
    sendSuccess(res, stats);
  },

  async recentAnalyses(req: Request, res: Response) {
    const analyses = await dashboardService.getRecentAnalyses(req.user!.id);
    sendSuccess(res, analyses);
  },
};
