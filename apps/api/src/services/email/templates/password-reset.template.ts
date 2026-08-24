interface PasswordResetTemplateInput {
  name: string;
  resetUrl: string;
}

export function buildPasswordResetEmail({ name, resetUrl }: PasswordResetTemplateInput) {
  const subject = 'Reinitialisation de votre mot de passe Tacynt Bet';

  const text = [
    `Bonjour ${name},`,
    '',
    'Vous avez demande la reinitialisation de votre mot de passe Tacynt Bet.',
    'Ce lien est valable 30 minutes :',
    resetUrl,
    '',
    "Si vous n'etes pas a l'origine de cette demande, ignorez cet email.",
    '',
    '-- Tacynt Bet',
  ].join('\n');

  const html = `
<div style="background-color:#0b0b0b;padding:40px 24px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
  <div style="max-width:420px;margin:0 auto;">
    <p style="color:#f4f1ea;font-size:18px;font-weight:600;margin:0 0 24px;">Tacynt Bet</p>
    <div style="background-color:#141311;border-radius:12px;padding:32px;">
      <h1 style="color:#f4f1ea;font-size:18px;margin:0 0 12px;">Reinitialisation de mot de passe</h1>
      <p style="color:#a6a099;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Bonjour ${name},<br />
        Vous avez demande la reinitialisation de votre mot de passe. Ce lien est valable 30 minutes.
      </p>
      <a href="${resetUrl}" style="display:inline-block;background-color:#c2410c;color:#f4f1ea;text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:8px;">
        Choisir un nouveau mot de passe
      </a>
    </div>
    <p style="color:#5c5850;font-size:12px;line-height:1.6;margin:24px 0 0;">
      Si vous n'etes pas a l'origine de cette demande, vous pouvez ignorer cet email.
    </p>
  </div>
</div>`.trim();

  return { subject, html, text };
}
