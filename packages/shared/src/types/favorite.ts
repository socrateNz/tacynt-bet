import type { FavoriteType } from '@tacynt/config';

export interface FavoriteDTO {
  id: string;
  type: FavoriteType;
  refId: string;
  createdAt: string;
}
