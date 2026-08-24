import { Schema, model, type InferSchemaType } from 'mongoose';
import { MARKET_TYPES, RISK_LEVELS } from '@tacynt/config';

const predictionSchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    aiAnalysisId: { type: Schema.Types.ObjectId, ref: 'AIAnalysis', required: true },
    market: { type: String, enum: MARKET_TYPES, required: true },
    selection: { type: String, required: true, trim: true },
    odds: { type: Number, required: true, min: 1 },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    risk: { type: String, enum: RISK_LEVELS, required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true },
);

predictionSchema.index({ matchId: 1 });
predictionSchema.index({ aiAnalysisId: 1 });

export type IPrediction = InferSchemaType<typeof predictionSchema>;

export const Prediction = model('Prediction', predictionSchema);
