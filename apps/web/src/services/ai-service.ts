import type { AIAnalysisResult } from '@tacynt/shared';

import { apiClient } from './api-client';

export const aiService = {
  analyzeMatch: (matchId: string) =>
    apiClient.post<AIAnalysisResult>(`/ai/matches/${matchId}/analyze`),
  getAnalysis: (id: string) => apiClient.get<AIAnalysisResult>(`/ai/analyses/${id}`),
};
