import { Schema, model, type InferSchemaType } from 'mongoose';
import { RISK_PROFILES, RISK_LEVELS, COUPON_STATUSES } from '@tacynt/config';

const couponSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetOdds: { type: Number, required: true, min: 1 },
    actualOdds: { type: Number, required: true, min: 1 },
    differenceFromTarget: { type: Number, required: true },
    riskProfile: { type: String, enum: RISK_PROFILES, required: true },
    risk: { type: String, enum: RISK_LEVELS, required: true },
    averageConfidence: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, enum: COUPON_STATUSES, default: 'PENDING' },
    /** Regroupe les N coupons produits par une meme requete "Creer un coupon". */
    generationBatchId: { type: String, required: true },
  },
  { timestamps: true },
);

couponSchema.index({ userId: 1, createdAt: -1 });
couponSchema.index({ generationBatchId: 1 });

export type ICoupon = InferSchemaType<typeof couponSchema>;

export const Coupon = model('Coupon', couponSchema);
