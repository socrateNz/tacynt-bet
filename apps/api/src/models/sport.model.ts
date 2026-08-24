import { Schema, model, type InferSchemaType } from 'mongoose';

const sportSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, trim: true },
  },
  { timestamps: true },
);

export type ISport = InferSchemaType<typeof sportSchema>;

export const Sport = model('Sport', sportSchema);
