import { Schema, model, type InferSchemaType } from 'mongoose';
import { MARKET_TYPES } from '@tacynt/config';

const couponSelectionSchema = new Schema(
  {
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    predictionId: { type: Schema.Types.ObjectId, ref: 'Prediction' },
    market: { type: String, enum: MARKET_TYPES, required: true },
    selection: { type: String, required: true, trim: true },
    odds: { type: Number, required: true, min: 1 },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    /** Reprise de la justification du Prediction d'origine, pour l'affichage cote client. */
    reason: { type: String, required: true },
  },
  { timestamps: true },
);

couponSelectionSchema.index({ couponId: 1 });

export type ICouponSelection = InferSchemaType<typeof couponSelectionSchema>;

export const CouponSelection = model('CouponSelection', couponSelectionSchema);
