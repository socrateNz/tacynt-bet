import type { Request, Response } from 'express';
import type { HistoryAnalysesQueryInput } from '@tacynt/shared';

import { historyService } from '../services/history.service';
import { sendSuccess } from '../utils/api-response';

export const historyController = {
  async stats(req: Request, res: Response) {
    const stats = await historyService.getStats(req.user!.id);
    sendSuccess(res, stats);
  },

  async analyses(req: Request, res: Response) {
    const query = req.validatedQuery as HistoryAnalysesQueryInput;
    const result = await historyService.listAnalyses(req.user!.id, query.page, query.limit);
    sendSuccess(res, result);
  },
};
