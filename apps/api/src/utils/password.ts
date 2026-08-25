import bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'node:crypto';

const SALT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Hash bcrypt factice (meme cout que SALT_ROUNDS), genere une fois au demarrage, pour occuper
 * le meme temps de calcul qu'une comparaison reelle quand l'utilisateur n'existe pas - evite
 * l'enumeration de comptes par mesure du temps de reponse du login.
 */
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing-normalization', SALT_ROUNDS);

export function compareAgainstDummyHash(password: string): Promise<boolean> {
  return bcrypt.compare(password, DUMMY_HASH);
}

/** Genere un token de reinitialisation en clair (envoye a l'utilisateur) + son empreinte (stockee en base). */
export function generateResetToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('hex');
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
