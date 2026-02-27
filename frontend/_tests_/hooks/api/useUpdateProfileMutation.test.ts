import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockUpdateProfile = vi.fn();

vi.mock('../../../src/services/authService', () => ({
  authService: {
    updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  },
}));

const { useUpdateProfileMutation } = await import('../../../src/hooks/api/useUpdateProfileMutation');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useUpdateProfileMutation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls authService.updateProfile with partialUser when mutateAsync is invoked', async () => {
    const partialUser = {
      id: 'user-1',
      name: 'Jane',
      lastname: 'Smith',
      document: '87654321',
      phone: '1122334455',
      lang: 'en',
    };
    const resolved = { message: 'Updated' };
    mockUpdateProfile.mockResolvedValue(resolved);

    const { result } = renderHook(() => useUpdateProfileMutation(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(partialUser);

    expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
    expect(mockUpdateProfile).toHaveBeenCalledWith(partialUser);
  });

  it('exposes data from authService.updateProfile when mutation succeeds', async () => {
    const partialUser = { name: 'UpdatedName', lastname: 'UpdatedLastname' };
    const resolved = { message: 'Profile updated' };
    mockUpdateProfile.mockResolvedValue(resolved);

    const { result } = renderHook(() => useUpdateProfileMutation(), {
      wrapper: createWrapper(),
    });

    const data = await result.current.mutateAsync(partialUser);

    expect(data).toEqual(resolved);
    await waitFor(() => {
      expect(result.current.data).toEqual(resolved);
    });
  });

  it('exposes error when authService.updateProfile rejects', async () => {
    const partialUser = { document: 'invalid' };
    const err = new Error('Validation failed');
    mockUpdateProfile.mockRejectedValue(err);

    const { result } = renderHook(() => useUpdateProfileMutation(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync(partialUser)).rejects.toEqual(err);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(err);
    });
  });
});
