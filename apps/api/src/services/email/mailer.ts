import nodemailer from 'nodemailer';

import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { AppError } from '../../utils/errors';

const isConfigured = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    })
  : null;

/** Verification best-effort au demarrage - un echec SMTP ne doit pas empecher l'API de tourner. */
export async function verifyMailer(): Promise<void> {
  if (!transporter) {
    logger.warn('SMTP non configure : les emails transactionnels sont desactives.');
    return;
  }

  try {
    await transporter.verify();
    logger.info('Serveur SMTP pret.');
  } catch (error) {
    logger.error({ error }, 'Echec de verification du serveur SMTP.');
  }
}

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendMail(input: SendMailInput): Promise<void> {
  if (!transporter) {
    throw AppError.internal("Le service d'email n'est pas configure.");
  }

  await transporter.sendMail({
    from: `"Tacynt Bet" <${env.SMTP_USER}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}
