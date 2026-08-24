import type { HydratedDocument } from 'mongoose';
import type { AuthSession, UserProfile } from '@tacynt/shared';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from '@tacynt/shared';

import { corsOrigins } from '../config/env';
import { User, type IUser } from '../models';
import { sendPasswordResetEmail } from './email';
import { AppError } from '../utils/errors';
import { signAccessToken } from '../utils/jwt';
import { comparePassword, generateResetToken, hashPassword, hashToken } from '../utils/password';

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

function toUserProfile(user: HydratedDocument<IUser>): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    plan: user.plan,
    createdAt: user.createdAt.toISOString(),
  };
}

function issueSession(user: HydratedDocument<IUser>): AuthSession {
  return {
    user: toUserProfile(user),
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
  };
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthSession> {
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      throw AppError.conflict('Un compte existe deja avec cet email.');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await User.create({ email: input.email, name: input.name, passwordHash });

    return issueSession(user);
  },

  async login(input: LoginInput): Promise<AuthSession> {
    const user = await User.findOne({ email: input.email }).select('+passwordHash');
    if (!user) {
      throw AppError.unauthorized('Email ou mot de passe incorrect.');
    }

    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw AppError.unauthorized('Email ou mot de passe incorrect.');
    }

    if (!user.isActive) {
      throw AppError.forbidden('Ce compte a ete desactive.');
    }

    return issueSession(user);
  },

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound('Utilisateur introuvable.');
    }
    return toUserProfile(user);
  },

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile> {
    const user = await User.findByIdAndUpdate(userId, { name: input.name }, { new: true });
    if (!user) {
      throw AppError.notFound('Utilisateur introuvable.');
    }
    return toUserProfile(user);
  },

  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      throw AppError.notFound('Utilisateur introuvable.');
    }

    const isValid = await comparePassword(input.currentPassword, user.passwordHash);
    if (!isValid) {
      throw AppError.validation('Mot de passe actuel incorrect.');
    }

    user.passwordHash = await hashPassword(input.newPassword);
    await user.save();
  },

  async requestPasswordReset(input: ForgotPasswordInput): Promise<void> {
    const user = await User.findOne({ email: input.email });

    // Ne jamais reveler si l'email existe ou non (evite l'enumeration de comptes).
    if (!user) {
      return;
    }

    const { token, tokenHash } = generateResetToken();
    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const resetUrl = `${corsOrigins[0]}/reset-password?token=${token}`;
    await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const tokenHash = hashToken(input.token);
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    }).select('+passwordResetTokenHash +passwordResetExpiresAt');

    if (!user) {
      throw AppError.validation('Le lien de reinitialisation est invalide ou expire.');
    }

    user.passwordHash = await hashPassword(input.password);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();
  },
};
