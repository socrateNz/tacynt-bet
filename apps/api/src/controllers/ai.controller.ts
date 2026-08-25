import type { Request, Response } from 'express';

import { matchAnalysisService } from '../services/match-analysis.service';
import { sendSuccess } from '../utils/api-response';

export const aiController = {
  async analyzeMatch(req: Request, res: Response) {
    const result = await matchAnalysisService.analyzeMatch(req.params.id as string, req.user!.id);
    sendSuccess(res, result);
  },

  async getAnalysis(req: Request, res: Response) {
    const result = await matchAnalysisService.getAnalysisById(req.params.id as string);
    sendSuccess(res, result);
  },
};
