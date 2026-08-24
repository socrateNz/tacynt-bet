import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .url({ message: 'NEXT_PUBLIC_API_URL doit etre une URL valide' })
    .default('http://localhost:4000/api'),
});

/**
 * Seules les variables prefixees NEXT_PUBLIC_ sont exposees au navigateur.
 * Aucun secret (ex: GEMINI_API_KEY) ne doit jamais transiter par ce fichier.
 */
export const env = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
