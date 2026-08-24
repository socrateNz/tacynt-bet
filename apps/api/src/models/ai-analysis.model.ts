import { Schema, model, type InferSchemaType } from 'mongoose';
import { RISK_LEVELS } from '@tacynt/config';

const aiAnalysisSchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    /** Utilisateur ayant declenche l'analyse en premier (l'analyse elle-meme est reutilisable). */
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    promptVersion: { type: String, required: true },
    model: { type: String, required: true },
    summary: { type: String, required: true },
    favorableFactors: { type: [String], default: [] },
    riskFactors: { type: [String], default: [] },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    risk: { type: String, enum: RISK_LEVELS, required: true },
    /** Reponse JSON brute de Gemini, conservee pour audit/debug. */
    rawResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

aiAnalysisSchema.index({ matchId: 1, promptVersion: 1, createdAt: -1 });

export type IAIAnalysis = InferSchemaType<typeof aiAnalysisSchema>;

export const AIAnalysis = model('AIAnalysis', aiAnalysisSchema);
