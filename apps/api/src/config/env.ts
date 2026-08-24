import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI est requis'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit contenir au moins 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  /** Ne jamais exposer cette valeur au frontend : usage backend uniquement. */
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY est requis'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Variables d'environnement invalides :");
    console.error(z.treeifyError(parsed.error));
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();

export const corsOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
