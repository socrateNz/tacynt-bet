'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { PredictionQueryInput } from '@tacynt/shared';

import { predictionService } from '@/services/prediction-service';

export function usePredictions(filters: Partial<PredictionQueryInput>) {
  return useQuery({
    queryKey: ['predictions', filters],
    queryFn: () => predictionService.list(filters),
    placeholderData: keepPreviousData,
  });
}
