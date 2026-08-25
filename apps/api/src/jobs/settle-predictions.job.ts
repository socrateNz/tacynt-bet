import mongoose from 'mongoose';

import { env } from '../config/env';
import { logger } from '../config/logger';
import { predictionResultService } from '../services/prediction-result.service';
import '../models';

async function main() {
  await mongoose.connect(env.MONGODB_URI);
  const result = await predictionResultService.settlePendingResults();
  logger.info(`Reglement termine : ${result.settled} pronostics regles.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  logger.error({ error }, 'Echec du reglement des pronostics');
  process.exit(1);
});
