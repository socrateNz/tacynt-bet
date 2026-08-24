import { Schema, model, type InferSchemaType } from 'mongoose';
import { MATCH_STATUSES } from '@tacynt/config';

const teamStatsSchema = new Schema(
  {
    played: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    cleanSheets: { type: Number, default: 0 },
    /** Resultats recents, du plus recent au plus ancien (ex: ['W','W','D','L','W']). */
    form: { type: [String], default: [] },
    overRate: { type: Number, min: 0, max: 100 },
    bttsRate: { type: Number, min: 0, max: 100 },
  },
  { _id: false },
);

const headToHeadEntrySchema = new Schema(
  {
    playedAt: { type: Date, required: true },
    competition: { type: String, trim: true },
    homeTeam: { type: String, required: true, trim: true },
    awayTeam: { type: String, required: true, trim: true },
    homeScore: { type: Number, required: true },
    awayScore: { type: Number, required: true },
  },
  { _id: false },
);

const absenceSchema = new Schema(
  {
    player: { type: String, required: true, trim: true },
    side: { type: String, enum: ['HOME', 'AWAY'], required: true },
    type: { type: String, enum: ['INJURY', 'SUSPENSION', 'OTHER'], default: 'OTHER' },
    detail: { type: String, trim: true },
  },
  { _id: false },
);

const matchSchema = new Schema(
  {
    sportId: { type: Schema.Types.ObjectId, ref: 'Sport', required: true },
    competitionId: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
    homeTeamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    awayTeamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    kickoffAt: { type: Date, required: true },
    status: { type: String, enum: MATCH_STATUSES, default: 'SCHEDULED' },
    venue: { type: String, trim: true },
    externalId: { type: String, trim: true },
    homeStats: { type: teamStatsSchema, default: () => ({}) },
    awayStats: { type: teamStatsSchema, default: () => ({}) },
    headToHead: { type: [headToHeadEntrySchema], default: [] },
    absences: { type: [absenceSchema], default: [] },
    finalScore: {
      home: { type: Number },
      away: { type: Number },
    },
  },
  { timestamps: true },
);

matchSchema.index({ kickoffAt: 1 });
matchSchema.index({ competitionId: 1, kickoffAt: 1 });
matchSchema.index({ status: 1 });

export type IMatch = InferSchemaType<typeof matchSchema>;

export const Match = model('Match', matchSchema);
