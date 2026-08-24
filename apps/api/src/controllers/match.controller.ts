import type { Request, Response } from 'express';
import type { MatchQueryInput } from '@tacynt/shared';

import { matchService } from '../services/match.service';
import { sendSuccess } from '../utils/api-response';

export const matchController = {
  async list(req: Request, res: Response) {
    const query = req.validatedQuery as MatchQueryInput;
    const result = await matchService.listMatches({ ...query, userId: req.user?.id });
    sendSuccess(res, result);
  },

  async detail(req: Request, res: Response) {
    const match = await matchService.getMatchById(req.params.id as string, req.user?.id);
    sendSuccess(res, match);
  },
};
