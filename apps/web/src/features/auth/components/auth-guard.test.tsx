import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/store/auth-store';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

import { AuthGuard } from './auth-guard';

function resetStore() {
  useAuthStore.setState({ user: null, accessToken: null, hasHydrated: false });
}

describe('AuthGuard', () => {
  beforeEach(() => {
    resetStore();
    replace.mockClear();
  });

  afterEach(() => {
    resetStore();
  });

  it('shows a loading skeleton before hydration and does not redirect yet', () => {
    render(
      <AuthGuard>
        <div>Protected content</div>
      </AuthGuard>,
    );
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirects to /login once hydrated with no access token', async () => {
    render(
      <AuthGuard>
        <div>Protected content</div>
      </AuthGuard>,
    );

    useAuthStore.setState({ hasHydrated: true, accessToken: null });

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children once hydrated with a valid access token', async () => {
    useAuthStore.setState({ hasHydrated: true, accessToken: 'fake-token' });

    render(
      <AuthGuard>
        <div>Protected content</div>
      </AuthGuard>,
    );

    await waitFor(() => expect(screen.getByText('Protected content')).toBeInTheDocument());
    expect(replace).not.toHaveBeenCalled();
  });
});
