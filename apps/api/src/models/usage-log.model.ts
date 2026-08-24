import { Schema, model, type InferSchemaType } from 'mongoose';
import { AI_OPERATIONS } from '@tacynt/config';

const usageLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    model: { type: String, required: true },
    operation: { type: String, enum: AI_OPERATIONS, required: true },
    tokensInput: { type: Number, required: true, min: 0 },
    tokensOutput: { type: Number, required: true, min: 0 },
    estimatedCost: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

usageLogSchema.index({ userId: 1, createdAt: -1 });
usageLogSchema.index({ operation: 1, createdAt: -1 });

export type IUsageLog = InferSchemaType<typeof usageLogSchema>;

export const UsageLog = model('UsageLog', usageLogSchema);
