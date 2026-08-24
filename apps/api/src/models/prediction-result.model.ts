import { Schema, model, type InferSchemaType } from 'mongoose';
import { PREDICTION_OUTCOMES } from '@tacynt/config';

const predictionResultSchema = new Schema(
  {
    predictionId: { type: Schema.Types.ObjectId, ref: 'Prediction', required: true, unique: true },
    /** Denormalise depuis Prediction.matchId pour les agregations de performance par sport. */
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    outcome: { type: String, enum: PREDICTION_OUTCOMES, default: 'PENDING' },
    settledAt: { type: Date },
  },
  { timestamps: true },
);

predictionResultSchema.index({ matchId: 1 });
predictionResultSchema.index({ outcome: 1 });

export type IPredictionResult = InferSchemaType<typeof predictionResultSchema>;

export const PredictionResult = model('PredictionResult', predictionResultSchema);
