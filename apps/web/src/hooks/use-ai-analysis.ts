'use client';

import { useMutation } from '@tanstack/react-query';

import { ApiRequestError } from '@/services/api-client';
import { aiService } from '@/services/ai-service';

export function useAnalyzeMatch(matchId: string) {
  return useMutation({
    mutationFn: () => aiService.analyzeMatch(matchId),
  });
}

export function analysisErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }
  return "L'analyse IA a echoue. Reessayez dans quelques instants.";
}
