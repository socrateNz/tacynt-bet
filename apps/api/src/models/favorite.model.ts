import { Schema, model, type InferSchemaType } from 'mongoose';
import { FAVORITE_TYPES } from '@tacynt/config';

const favoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: FAVORITE_TYPES, required: true },
    /** ObjectId polymorphe : pointe vers Team, Competition ou Match selon `type`. */
    refId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, type: 1, refId: 1 }, { unique: true });

export type IFavorite = InferSchemaType<typeof favoriteSchema>;

export const Favorite = model('Favorite', favoriteSchema);
