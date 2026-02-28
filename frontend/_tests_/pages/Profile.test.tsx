import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test-utils';
import Profile from '../../src/pages/Profile';
import { apiClient } from '../../src/config/axiosInstance';

vi.mock('../../src/config/axiosInstance', () => ({
  apiClient: {
    put: vi.fn(),
    get: vi.fn().mockResolvedValue({ user: null }),
  },
}));

const mockUser = {
  id: '1',
  name: 'John',
  lastname: 'Doe',
  email: 'john@test.com',
  document: '123',
  phone: '555',
  lang: 'en',
  role: 'USER',
};
vi.mock('../../src/hooks/api/useUserInformation', () => ({
  useUserInformation: () => ({
    data: mockUser,
    isLoading: false,
    refetch: vi.fn(),
  }),
}));

describe('Profile page', () => {
  beforeEach(() => {
    vi.mocked(apiClient.put).mockReset?.();
    localStorage.setItem(
      'woow_auth',
      JSON.stringify({
        token: 'fake-token',
        user: {
          id: '1',
          name: 'John',
          lastname: 'Doe',
          email: 'john@test.com',
          document: '123',
          phone: '555',
          lang: 'en',
          role: 'USER',
        },
      })
    );
  });

  it('renders profile form with user data', async () => {
    render(<Profile />, { withAuth: true });
    expect(await screen.findByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /profile\.save|guardar|save/i })
    ).toBeInTheDocument();
  });
});
