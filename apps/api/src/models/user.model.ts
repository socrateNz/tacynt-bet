import { Schema, model, type InferSchemaType } from 'mongoose';
import { USER_ROLES, USER_PLANS } from '@tacynt/config';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    /** Hash bcrypt uniquement - jamais le mot de passe en clair. */
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: USER_ROLES, default: 'USER' },
    plan: { type: String, enum: USER_PLANS, default: 'FREE' },
    isActive: { type: Boolean, default: true },
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
  },
  { timestamps: true },
);

export type IUser = InferSchemaType<typeof userSchema>;

export const User = model('User', userSchema);
