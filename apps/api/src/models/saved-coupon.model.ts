import { Schema, model, type InferSchemaType } from 'mongoose';

const savedCouponSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

savedCouponSchema.index({ userId: 1, couponId: 1 }, { unique: true });

export type ISavedCoupon = InferSchemaType<typeof savedCouponSchema>;

export const SavedCoupon = model('SavedCoupon', savedCouponSchema);
