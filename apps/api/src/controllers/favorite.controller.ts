import type { Request, Response } from 'express';

import { favoriteService } from '../services/favorite.service';
import { sendSuccess } from '../utils/api-response';

export const favoriteController = {
  async list(req: Request, res: Response) {
    const favorites = await favoriteService.list(req.user!.id);
    sendSuccess(res, favorites);
  },

  async create(req: Request, res: Response) {
    const favorite = await favoriteService.create(req.user!.id, req.body);
    sendSuccess(res, favorite, 201);
  },

  async remove(req: Request, res: Response) {
    await favoriteService.remove(req.user!.id, req.params.id as string);
    sendSuccess(res, null);
  },
};
