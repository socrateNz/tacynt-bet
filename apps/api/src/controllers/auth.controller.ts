import type { Request, Response } from 'express';

import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/api-response';

export const authController = {
  async register(req: Request, res: Response) {
    const session = await authService.register(req.body);
    sendSuccess(res, session, 201);
  },

  async login(req: Request, res: Response) {
    const session = await authService.login(req.body);
    sendSuccess(res, session);
  },

  async logout(_req: Request, res: Response) {
    // JWT sans etat : la deconnexion est geree cote client (suppression du token).
    sendSuccess(res, null);
  },

  async me(req: Request, res: Response) {
    const profile = await authService.getProfile(req.user!.id);
    sendSuccess(res, profile);
  },

  async updateProfile(req: Request, res: Response) {
    const profile = await authService.updateProfile(req.user!.id, req.body);
    sendSuccess(res, profile);
  },

  async changePassword(req: Request, res: Response) {
    await authService.changePassword(req.user!.id, req.body);
    sendSuccess(res, { message: 'Mot de passe mis a jour.' });
  },

  async forgotPassword(req: Request, res: Response) {
    const result = await authService.requestPasswordReset(req.body);
    sendSuccess(res, {
      message: 'Si un compte existe avec cet email, un lien de reinitialisation a ete envoye.',
      ...result,
    });
  },

  async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body);
    sendSuccess(res, { message: 'Mot de passe reinitialise avec succes.' });
  },
};
