import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '../test-utils';
import UserList from '../../src/pages/UserList';
import type { UserFilterValues } from '../../src/hooks/users/useUserFilters';
import type { PageSizeOption } from '../../src/hooks/users/useUserTableState';

const mockSetPage = vi.fn();
const mockSetPageSize = vi.fn();
const mockApplyFilters = vi.fn();
const mockClearFilters = vi.fn();

vi.mock('../../src/hooks/api/useUserListQuery', () => ({
  useUserListQuery: vi.fn(),
}));

vi.mock('../../src/hooks/users/useUserTableState', () => ({
  useUserTableState: vi.fn(),
}));

vi.mock('../../src/hooks/users/useUserFilters', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/hooks/users/useUserFilters')>();
  return {
    ...actual,
    useUserFilters: vi.fn(),
  };
});

const mockT = vi.fn((key: string) => {
  const map: Record<string, string> = {
    'users.title': 'Users',
    'users.filters.name': 'Name',
    'users.filters.placeholderName': 'Name',
    'users.filters.document': 'Document',
    'users.filters.placeholderDocument': 'Document',
    'users.filters.phone': 'Phone',
    'users.filters.placeholderPhone': 'Phone',
    'users.filters.clear': 'Clear',
    'users.filters.search': 'Search',
    'users.filters.searching': 'Searching...',
    'users.table.loading': 'Loading users...',
    'users.table.noUsers': 'No users found',
    'users.table.rowsPerPage': 'Rows per page',
    'users.table.previous': 'Previous',
    'users.table.next': 'Next',
    'users.table.page': 'Page',
    'users.table.of': 'of',
    'users.table.totalUsers': 'Total users:',
  };
  return map[key] ?? key;
});

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: {} }),
  };
});

const { useUserListQuery } = await import('../../src/hooks/api/useUserListQuery');
const { useUserTableState } = await import('../../src/hooks/users/useUserTableState');
const { useUserFilters } = await import('../../src/hooks/users/useUserFilters');

const mockUser = {
  id: '1',
  name: 'John',
  lastname: 'Doe',
  email: 'john@test.com',
  document: '123',
  phone: '555',
  lang: 'es',
  role: 'USER',
};

const defaultQueryData = {
  users: [mockUser],
  itemsTotal: 1,
  page: 1,
  totalPage: 1,
  nextPage: undefined,
  prevPage: undefined,
};

function renderUserList() {
  return render(<UserList />);
}

describe('UserList page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUserTableState).mockReturnValue({
      page: 1,
      pageSize: 10 as PageSizeOption,
      setPage: mockSetPage,
      setPageSize: mockSetPageSize,
      pageSizeOptions: [10, 15, 20],
    });
    vi.mocked(useUserFilters).mockReturnValue({
      appliedFilters: { name: '', document: '', phone: '' } as UserFilterValues,
      searchVersion: 0,
      applyFilters: mockApplyFilters,
      clearFilters: mockClearFilters,
    });
    vi.mocked(useUserListQuery).mockReturnValue({
      data: defaultQueryData,
      isLoading: false,
      isFetching: false,
      error: null,
    } as ReturnType<typeof useUserListQuery>);
  });

  it('renders title and UserTable with data from query', () => {
    renderUserList();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  it('on search submit calls setPage(1) and applyFilters with form values', async () => {
    const user = userEvent.setup();
    renderUserList();

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Jane');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockApplyFilters).toHaveBeenCalledTimes(1);
    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane',
      })
    );
  });

  it('on clear calls clearFilters and setPage(1)', async () => {
    const user = userEvent.setup();
    renderUserList();

    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(mockClearFilters).toHaveBeenCalledTimes(1);
    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  it('UserTable receives users, page, total, pageSize and callbacks from state and query', () => {
    vi.mocked(useUserListQuery).mockReturnValue({
      data: { ...defaultQueryData, page: 2, itemsTotal: 25 },
      isLoading: false,
      isFetching: false,
      error: null,
    } as ReturnType<typeof useUserListQuery>);

    renderUserList();

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // page number in pagination
  });

  it('shows error message when API returns error', () => {
    vi.mocked(useUserListQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      error: { message: 'Network error' },
    } as ReturnType<typeof useUserListQuery>);

    renderUserList();

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    vi.mocked(useUserListQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      error: null,
    } as ReturnType<typeof useUserListQuery>);

    renderUserList();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
