import { Schema, model, type InferSchemaType } from 'mongoose';
import { MARKET_TYPES } from '@tacynt/config';

const oddsSchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    market: { type: String, enum: MARKET_TYPES, required: true },
    /** Ex: 'HOME' | 'DRAW' | 'AWAY' | 'OVER_2_5' | 'BTTS_YES' ... selon le marche. */
    selection: { type: String, required: true, trim: true },
    value: { type: Number, required: true, min: 1 },
    bookmaker: { type: String, trim: true, default: 'aggregated' },
    externalId: { type: String, trim: true },
  },
  { timestamps: true },
);

oddsSchema.index({ matchId: 1, market: 1, selection: 1 }, { unique: true });

export type IOdds = InferSchemaType<typeof oddsSchema>;

export const Odds = model('Odds', oddsSchema);
