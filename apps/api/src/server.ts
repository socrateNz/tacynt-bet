import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase } from './config/database';
import { createApp } from './app';
import { verifyMailer } from './services/email';
import './models';

async function bootstrap() {
  await connectDatabase();
  await verifyMailer();

  const app = createApp();

  const server = app.listen(env.API_PORT, () => {
    logger.info(`Tacynt Bet API demarree sur le port ${env.API_PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal: string) => {
    logger.info(`Signal ${signal} recu, arret du serveur...`);
    server.close(() => {
      logger.info('Serveur HTTP arrete.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  logger.error({ error }, 'Echec du demarrage du serveur');
  process.exit(1);
});
