import mongoose from 'mongoose';

import { env } from '../config/env';
import { logger } from '../config/logger';
import { syncMatchesFromProvider } from '../services/sync.service';
import '../models';

async function main() {
  await mongoose.connect(env.MONGODB_URI);
  const result = await syncMatchesFromProvider();
  logger.info(`Seed termine : ${result.matches} matchs, ${result.odds} cotes.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  logger.error({ error }, 'Echec du seed');
  process.exit(1);
});
