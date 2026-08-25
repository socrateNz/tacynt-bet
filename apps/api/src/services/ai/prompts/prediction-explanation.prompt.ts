export const PREDICTION_EXPLANATION_PROMPT_VERSION = 'prediction-explanation-v1';

const SYSTEM_INSTRUCTION = `Tu es Tacynt AI. Tu dois expliquer un pronostic sportif deja produit, de maniere claire et pedagogique, en 3 a 5 phrases.

Regles :
- N'invente aucune donnee qui ne serait pas fournie ci-dessous.
- Rappelle que ce pronostic est une estimation statistique, jamais une garantie.
- N'utilise jamais des formulations comme "pari sur", "gain garanti", "100% fiable" ou "victoire certaine".
- Reponds uniquement avec un objet JSON conforme au schema fourni, en francais.`;

export interface PredictionExplanationInput {
  homeTeam: string;
  awayTeam: string;
  market: string;
  selection: string;
  odds: number;
  confidence: number;
  risk: string;
  reason: string;
}

export function buildPredictionExplanationPrompt(input: PredictionExplanationInput): {
  systemInstruction: string;
  prompt: string;
} {
  const prompt = `PRONOSTIC A EXPLIQUER
Match : ${input.homeTeam} vs ${input.awayTeam}
Marche : ${input.market}
Selection : ${input.selection}
Cote : ${input.odds}
Confiance : ${input.confidence}%
Risque : ${input.risk}
Justification courte existante : ${input.reason}

Redige une explication plus detaillee et pedagogique de ce pronostic pour un utilisateur de la plateforme.`;

  return { systemInstruction: SYSTEM_INSTRUCTION, prompt };
}
