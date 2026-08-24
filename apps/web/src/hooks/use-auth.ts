'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from '@tacynt/shared';

import { ApiRequestError } from '@/services/api-client';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import { ROUTES } from '@/constants/routes';

const authKeys = {
  me: ['auth', 'me'] as const,
};

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiRequestError ? error.message : fallback;
}

export function useMe() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  return useQuery({
    queryKey: authKeys.me,
    queryFn: authService.me,
    enabled: hasHydrated && Boolean(accessToken),
    retry: false,
  });
}

export function useRegister() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (session) => {
      setSession(session);
      toast.success(`Bienvenue ${session.user.name} !`);
      router.push(ROUTES.dashboard);
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Impossible de creer le compte.'));
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (session) => {
      setSession(session);
      toast.success('Connexion reussie.');
      router.push(ROUTES.dashboard);
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Connexion impossible.'));
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.push(ROUTES.login);
    },
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => authService.updateProfile(input),
    onSuccess: (profile) => {
      setUser(profile);
      queryClient.setQueryData(authKeys.me, profile);
      toast.success('Profil mis a jour.');
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Mise a jour impossible.'));
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => authService.changePassword(input),
    onSuccess: () => {
      toast.success('Mot de passe mis a jour.');
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Le changement de mot de passe a echoue.'));
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authService.forgotPassword(input),
    onError: (error) => {
      toast.error(errorMessage(error, 'Une erreur est survenue.'));
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: ResetPasswordInput) => authService.resetPassword(input),
    onSuccess: () => {
      toast.success('Mot de passe reinitialise. Vous pouvez vous connecter.');
      router.push(ROUTES.login);
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Le lien est invalide ou expire.'));
    },
  });
}
