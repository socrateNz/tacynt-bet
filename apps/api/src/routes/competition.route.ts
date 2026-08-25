import { Router } from 'express';

import { referenceDataController } from '../controllers/reference-data.controller';

export const competitionRouter = Router();

competitionRouter.get('/', referenceDataController.listCompetitions);
