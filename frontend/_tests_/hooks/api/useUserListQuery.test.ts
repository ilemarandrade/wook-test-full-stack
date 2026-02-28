import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockListUsers = vi.fn();

vi.mock('../../../src/services/userService', () => ({
  userService: {
    listUsers: (...args: unknown[]) => mockListUsers(...args),
  },
}));

const { useUserListQuery } =
  await import('../../../src/hooks/api/useUserListQuery');

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

const defaultFilters = {
  name: '',
  document: '',
  phone: '',
};

describe('useUserListQuery', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls userService.listUsers with page, pageSize and filters (name, document, phone)', async () => {
    const listResponse = {
      users: [],
      itemsTotal: 0,
      page: 1,
      totalPage: 1,
    };
    mockListUsers.mockResolvedValue(listResponse);

    const filters = {
      name: 'John',
      document: '123',
      phone: '999',
    };

    renderHook(
      () =>
        useUserListQuery({
          page: 2,
          pageSize: 20,
          filters,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(mockListUsers).toHaveBeenCalledTimes(1);
      expect(mockListUsers).toHaveBeenCalledWith({
        page: 2,
        pageSize: 20,
        name: 'John',
        document: '123',
        phone: '999',
      });
    });
  });

  it('exposes data from userService.listUsers when query succeeds', async () => {
    const listResponse = {
      users: [
        {
          id: 'u1',
          name: 'User',
          lastname: 'One',
          email: 'u1@test.com',
          document: '111',
          phone: '111',
          lang: 'es',
          role: 'user',
        },
      ],
      itemsTotal: 1,
      page: 1,
      totalPage: 1,
    };
    mockListUsers.mockResolvedValue(listResponse);

    const { result } = renderHook(
      () =>
        useUserListQuery({
          page: 1,
          pageSize: 10,
          filters: defaultFilters,
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(listResponse);
    });
  });

  it('re-runs query when filters change', async () => {
    const listResponse = {
      users: [],
      itemsTotal: 0,
      page: 1,
      totalPage: 1,
    };
    mockListUsers.mockResolvedValue(listResponse);

    const { result, rerender } = renderHook(
      (props: {
        page: number;
        pageSize: number;
        filters: typeof defaultFilters;
      }) => useUserListQuery(props),
      {
        wrapper: createWrapper(),
        initialProps: {
          page: 1,
          pageSize: 10,
          filters: defaultFilters,
        },
      }
    );

    await waitFor(() => {
      expect(mockListUsers).toHaveBeenCalledTimes(1);
    });

    rerender({
      page: 1,
      pageSize: 10,
      filters: { ...defaultFilters, name: 'Jane' },
    });

    await waitFor(() => {
      expect(mockListUsers).toHaveBeenCalledTimes(2);
      expect(mockListUsers).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 10,
        name: 'Jane',
        document: '',
        phone: '',
      });
    });
  });
});
