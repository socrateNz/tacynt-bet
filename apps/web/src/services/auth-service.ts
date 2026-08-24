import type {
  AuthSession,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateProfileInput,
  UserProfile,
} from '@tacynt/shared';

import { apiClient } from './api-client';

export const authService = {
  register: (input: RegisterInput) =>
    apiClient.post<AuthSession>('/auth/register', input, { withAuth: false }),
  login: (input: LoginInput) =>
    apiClient.post<AuthSession>('/auth/login', input, { withAuth: false }),
  logout: () => apiClient.post<null>('/auth/logout'),
  me: () => apiClient.get<UserProfile>('/auth/me'),
  updateProfile: (input: UpdateProfileInput) =>
    apiClient.patch<UserProfile>('/auth/profile', input),
  changePassword: (input: ChangePasswordInput) =>
    apiClient.patch<{ message: string }>('/auth/change-password', input),
  forgotPassword: (input: ForgotPasswordInput) =>
    apiClient.post<{ message: string }>('/auth/forgot-password', input, { withAuth: false }),
  resetPassword: (input: ResetPasswordInput) =>
    apiClient.post<{ message: string }>('/auth/reset-password', input, { withAuth: false }),
};
