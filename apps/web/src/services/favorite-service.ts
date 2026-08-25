import type { CreateFavoriteInput, FavoriteDTO } from '@tacynt/shared';

import { apiClient } from './api-client';

export const favoriteService = {
  list: () => apiClient.get<FavoriteDTO[]>('/favorites'),
  create: (input: CreateFavoriteInput) => apiClient.post<FavoriteDTO>('/favorites', input),
  remove: (id: string) => apiClient.delete<null>(`/favorites/${id}`),
};
