import type { Request, Response } from 'express';

import { referenceDataService } from '../services/reference-data.service';
import { sendSuccess } from '../utils/api-response';

export const referenceDataController = {
  async listCompetitions(_req: Request, res: Response) {
    const competitions = await referenceDataService.listCompetitions();
    sendSuccess(res, competitions);
  },
};
