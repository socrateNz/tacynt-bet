import { sendMail, verifyMailer } from './mailer';
import { buildPasswordResetEmail } from './templates/password-reset.template';

export { verifyMailer };

export async function sendPasswordResetEmail(input: {
  to: string;
  name: string;
  resetUrl: string;
}): Promise<void> {
  const { subject, html, text } = buildPasswordResetEmail(input);
  await sendMail({ to: input.to, subject, html, text });
}
