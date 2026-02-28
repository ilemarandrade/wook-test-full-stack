import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockLogin = vi.fn();

vi.mock('../../../src/services/authService', () => ({
  authService: {
    login: (...args: unknown[]) => mockLogin(...args),
  },
}));

const { useLoginMutation } =
  await import('../../../src/hooks/api/useLoginMutation');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

describe('useLoginMutation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls authService.login with values when mutateAsync is invoked', async () => {
    const values = { email: 'a@b.com', password: 'secret123' };
    const resolved = { jwt: 'token-xyz' };
    mockLogin.mockResolvedValue(resolved);

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(values);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith(values);
  });

  it('exposes data from authService.login when mutation succeeds', async () => {
    const values = { email: 'x@y.com', password: 'pass456' };
    const resolved = { jwt: 'another-token' };
    mockLogin.mockResolvedValue(resolved);

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    const data = await result.current.mutateAsync(values);

    expect(data).toEqual(resolved);
    await waitFor(() => {
      expect(result.current.data).toEqual(resolved);
    });
  });

  it('exposes error when authService.login rejects', async () => {
    const values = { email: 'a@b.com', password: 'wrong' };
    const err = new Error('Invalid credentials');
    mockLogin.mockRejectedValue(err);

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync(values)).rejects.toEqual(err);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(err);
    });
  });
});
