import { GoogleGenAI } from '@google/genai';
import { z, type ZodType } from 'zod';

import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { AppError } from '../../utils/errors';

const client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export interface GeminiUsage {
  model: string;
  tokensInput: number;
  tokensOutput: number;
}

export interface GeminiJsonResult<T> {
  data: T;
  usage: GeminiUsage;
}

interface GenerateJsonInput<T> {
  systemInstruction: string;
  prompt: string;
  schema: ZodType<T>;
  temperature?: number;
}

/**
 * Appelle Gemini en mode sortie structuree (JSON) et valide la reponse avec le schema Zod
 * fourni - jamais de confiance directe dans une reponse LLM (section securite du cahier des
 * charges).
 */
export async function generateJson<T>({
  systemInstruction,
  prompt,
  schema,
  temperature = 0.4,
}: GenerateJsonInput<T>): Promise<GeminiJsonResult<T>> {
  let response;

  try {
    response = await client.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        temperature,
        responseMimeType: 'application/json',
        responseJsonSchema: z.toJSONSchema(schema),
      },
    });
  } catch (error) {
    logger.error({ error }, "Echec de l'appel Gemini");
    throw AppError.aiService("Le service d'analyse IA est momentanement indisponible.");
  }

  const text = response.text;
  if (!text) {
    throw AppError.aiService('Reponse vide du service IA.');
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    logger.error({ text }, 'Reponse Gemini non-JSON');
    throw AppError.aiService('Reponse du service IA illisible.');
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    logger.error({ issues: parsed.error.issues, raw }, 'Reponse Gemini invalide (schema)');
    throw AppError.aiService('Reponse du service IA invalide.');
  }

  return {
    data: parsed.data,
    usage: {
      model: response.modelVersion ?? env.GEMINI_MODEL,
      tokensInput: response.usageMetadata?.promptTokenCount ?? 0,
      tokensOutput: response.usageMetadata?.candidatesTokenCount ?? 0,
    },
  };
}
