import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockRegister = vi.fn();

vi.mock('../../../src/services/authService', () => ({
  authService: {
    register: (...args: unknown[]) => mockRegister(...args),
  },
}));

const { useRegisterMutation } = await import('../../../src/hooks/api/useRegisterMutation');

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

describe('useRegisterMutation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls authService.register with values when mutateAsync is invoked', async () => {
    const values = {
      name: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      document: '12345678',
      phone: '9876543210',
      password: 'secret123',
      confirmPassword: 'secret123',
    };
    const resolved = { message: 'OK' };
    mockRegister.mockResolvedValue(resolved);

    const { result } = renderHook(() => useRegisterMutation(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(values);

    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toHaveBeenCalledWith(values);
  });

  it('exposes data from authService.register when mutation succeeds', async () => {
    const values = {
      name: 'Jane',
      lastname: 'Smith',
      email: 'jane@example.com',
      document: '87654321',
      password: 'pass456',
      confirmPassword: 'pass456',
    };
    const resolved = { message: 'Created' };
    mockRegister.mockResolvedValue(resolved);

    const { result } = renderHook(() => useRegisterMutation(), {
      wrapper: createWrapper(),
    });

    const data = await result.current.mutateAsync(values);

    expect(data).toEqual(resolved);
    await waitFor(() => {
      expect(result.current.data).toEqual(resolved);
    });
  });

  it('exposes error when authService.register rejects', async () => {
    const values = {
      name: 'John',
      lastname: 'Doe',
      email: 'existing@example.com',
      document: '12345678',
      password: 'secret123',
      confirmPassword: 'secret123',
    };
    const err = new Error('Email already registered');
    mockRegister.mockRejectedValue(err);

    const { result } = renderHook(() => useRegisterMutation(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync(values)).rejects.toEqual(err);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(err);
    });
  });
});
