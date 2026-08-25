import type { HydratedDocument } from 'mongoose';
import type { CreateFavoriteInput, FavoriteDTO } from '@tacynt/shared';

import { Favorite, type IFavorite } from '../models';
import { AppError } from '../utils/errors';

function toDTO(favorite: HydratedDocument<IFavorite>): FavoriteDTO {
  return {
    id: favorite.id,
    type: favorite.type,
    refId: favorite.refId.toString(),
    createdAt: favorite.createdAt.toISOString(),
  };
}

export const favoriteService = {
  async list(userId: string): Promise<FavoriteDTO[]> {
    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
    return favorites.map(toDTO);
  },

  async create(userId: string, input: CreateFavoriteInput): Promise<FavoriteDTO> {
    const existing = await Favorite.findOne({ userId, type: input.type, refId: input.refId });
    if (existing) {
      return toDTO(existing);
    }

    const favorite = await Favorite.create({ userId, type: input.type, refId: input.refId });
    return toDTO(favorite);
  },

  async remove(userId: string, id: string): Promise<void> {
    const result = await Favorite.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      throw AppError.notFound('Favori introuvable.');
    }
  },
};
