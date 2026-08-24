import { Schema, model, type InferSchemaType } from 'mongoose';

const competitionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    sportId: { type: Schema.Types.ObjectId, ref: 'Sport', required: true },
    country: { type: String, trim: true },
    logo: { type: String, trim: true },
    externalId: { type: String, trim: true },
  },
  { timestamps: true },
);

competitionSchema.index({ sportId: 1, slug: 1 }, { unique: true });

export type ICompetition = InferSchemaType<typeof competitionSchema>;

export const Competition = model('Competition', competitionSchema);
