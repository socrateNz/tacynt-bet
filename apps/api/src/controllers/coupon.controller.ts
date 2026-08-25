import type { Request, Response } from 'express';
import type { CouponQueryInput } from '@tacynt/shared';

import { couponService } from '../services/coupon.service';
import { sendSuccess } from '../utils/api-response';

export const couponController = {
  async generate(req: Request, res: Response) {
    const result = await couponService.generate(req.user!.id, req.body);
    sendSuccess(res, result, 201);
  },

  async list(req: Request, res: Response) {
    const query = req.validatedQuery as CouponQueryInput;
    const result = await couponService.list(req.user!.id, query);
    sendSuccess(res, result);
  },

  async detail(req: Request, res: Response) {
    const result = await couponService.getById(req.user!.id, req.params.id as string);
    sendSuccess(res, result);
  },

  async save(req: Request, res: Response) {
    const result = await couponService.save(req.user!.id, req.params.id as string);
    sendSuccess(res, result);
  },

  async remove(req: Request, res: Response) {
    await couponService.remove(req.user!.id, req.params.id as string);
    sendSuccess(res, null);
  },
};
