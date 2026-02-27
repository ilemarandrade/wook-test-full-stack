import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserFilterForm } from '../../../src/components/users/UserFilterForm';
import type { UserFilterValues } from '../../../src/hooks/users/useUserFilters';

const mockT = vi.fn((key: string) => {
  const map: Record<string, string> = {
    'users.filters.name': 'Name',
    'users.filters.placeholderName': 'Name',
    'users.filters.document': 'Document',
    'users.filters.placeholderDocument': 'Document',
    'users.filters.phone': 'Phone',
    'users.filters.placeholderPhone': 'Phone',
    'users.filters.clear': 'Clear',
    'users.filters.search': 'Search',
    'users.filters.searching': 'Searching...',
  };
  return map[key] ?? key;
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: mockT, i18n: {} }),
}));

describe('UserFilterForm', () => {
  const initialValues: UserFilterValues = {
    name: 'John',
    document: '123',
    phone: '555',
  };

  const defaultProps = {
    initialValues,
    onSearch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initialValues in the form fields', () => {
    render(<UserFilterForm {...defaultProps} />);

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('555')).toBeInTheDocument();
  });

  it('calls onSearch with form values on submit', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<UserFilterForm {...defaultProps} onSearch={onSearch} />);

    await user.clear(screen.getByDisplayValue('John'));
    await user.type(screen.getByPlaceholderText('Name'), 'Jane');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane',
        document: '123',
        phone: '555',
      })
    );
  });

  it('when onReset is provided, Clear button resets form and calls onReset', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<UserFilterForm {...defaultProps} onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('when isSearching is true, search button is disabled and shows Searching...', () => {
    render(<UserFilterForm {...defaultProps} isSearching />);

    const searchButton = screen.getByRole('button', { name: 'Searching...' });
    expect(searchButton).toBeDisabled();
  });
});
