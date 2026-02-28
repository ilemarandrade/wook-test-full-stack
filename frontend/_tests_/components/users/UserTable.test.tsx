import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserTable } from '../../../src/components/users/UserTable';
import type { User } from '../../../src/context/AuthContext';
import type { PageSizeOption } from '../../../src/hooks/users/useUserTableState';

const mockT = vi.fn((key: string) => {
  const map: Record<string, string> = {
    'users.table.name': 'Name',
    'users.table.lastname': 'Last name',
    'users.table.email': 'Email',
    'users.table.document': 'Document',
    'users.table.phone': 'Phone',
    'users.table.role': 'Role',
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

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockT, i18n: {} }),
}));

const mockUser: User = {
  id: '1',
  name: 'John',
  lastname: 'Doe',
  email: 'john@test.com',
  document: '123',
  phone: '555',
  lang: 'es',
  role: 'USER',
};

const defaultProps = {
  users: [] as User[],
  isLoading: false,
  page: 1,
  pageSize: 10 as PageSizeOption,
  total: 0,
  pageSizeOptions: [10, 15, 20] as const,
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
};

describe('UserTable', () => {
  it('shows loading state when isLoading is true', () => {
    render(<UserTable {...defaultProps} isLoading />);
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  it('shows error message when errorMessage is provided', () => {
    render(<UserTable {...defaultProps} errorMessage="Network error" />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('shows "No users found" when users is empty and not loading/error', () => {
    render(<UserTable {...defaultProps} />);
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('renders user rows with name, lastname, email, document, phone, role', () => {
    render(<UserTable {...defaultProps} users={[mockUser]} total={1} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('555')).toBeInTheDocument();
    expect(screen.getByText('USER')).toBeInTheDocument();
  });

  it('calls onPageChange(prevPage) when Previous is clicked and prevPage is defined', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <UserTable
        {...defaultProps}
        users={[mockUser]}
        total={10}
        prevPage={1}
        nextPage={3}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('Previous button is disabled when prevPage is not defined', () => {
    render(
      <UserTable {...defaultProps} users={[mockUser]} total={10} nextPage={2} />
    );
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('calls onPageChange(nextPage) when Next is clicked and nextPage is defined', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <UserTable
        {...defaultProps}
        users={[mockUser]}
        total={10}
        prevPage={1}
        nextPage={2}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('Next button is disabled when nextPage is not defined', () => {
    render(
      <UserTable {...defaultProps} users={[mockUser]} total={10} prevPage={1} />
    );
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('calls onPageSizeChange when page size select changes', async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();
    render(<UserTable {...defaultProps} onPageSizeChange={onPageSizeChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '20');

    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('shows Page X of Y and total users', () => {
    render(
      <UserTable
        {...defaultProps}
        users={[mockUser]}
        page={2}
        total={25}
        prevPage={1}
        nextPage={3}
      />
    );

    expect(screen.getByText(/Page/)).toBeInTheDocument();
    expect(screen.getByText(/of/)).toBeInTheDocument();
    expect(screen.getByText('Total users:')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Previous' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });
});
