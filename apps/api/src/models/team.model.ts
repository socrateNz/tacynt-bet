import { Schema, model, type InferSchemaType } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    sportId: { type: Schema.Types.ObjectId, ref: 'Sport', required: true },
    country: { type: String, trim: true },
    logo: { type: String, trim: true },
    externalId: { type: String, trim: true },
  },
  { timestamps: true },
);

teamSchema.index({ sportId: 1, slug: 1 }, { unique: true });

export type ITeam = InferSchemaType<typeof teamSchema>;

export const Team = model('Team', teamSchema);
