import type { UserRole, UserPlan } from '@tacynt/config';

/** DTO utilisateur cote API - ne contient jamais passwordHash ni les champs de reset. */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: UserPlan;
  createdAt: string;
}

export interface AuthSession {
  user: UserProfile;
  accessToken: string;
}
