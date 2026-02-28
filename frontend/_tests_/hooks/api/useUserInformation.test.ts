import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockGetCurrentUser = vi.fn();

vi.mock('../../../src/services/authService', () => ({
  authService: {
    getCurrentUser: (...args: unknown[]) => mockGetCurrentUser(...args),
  },
}));

const { useUserInformation } =
  await import('../../../src/hooks/api/useUserInformation');

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

describe('useUserInformation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls authService.getCurrentUser when query is enabled', async () => {
    const mockUser = {
      id: 'u1',
      name: 'Test',
      lastname: 'User',
      email: 't@t.com',
      document: '111',
      phone: '999',
      lang: 'es',
      role: 'user',
    };
    mockGetCurrentUser.mockResolvedValue(mockUser);

    renderHook(() => useUserInformation(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
    });
  });

  it('exposes isLoading true while loading, then data with user when resolved', async () => {
    const mockUser = {
      id: 'u2',
      name: 'Other',
      lastname: 'Person',
      email: 'o@o.com',
      document: '222',
      phone: '888',
      lang: null,
      role: 'admin',
    };
    mockGetCurrentUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockUser), 10);
        })
    );

    const { result } = renderHook(() => useUserInformation(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockUser);
    });
  });

  it('exposes isError and error when getCurrentUser fails', async () => {
    const err = new Error('Unauthorized');
    mockGetCurrentUser.mockRejectedValue(err);

    const { result } = renderHook(() => useUserInformation(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(err);
    });
  });
});
