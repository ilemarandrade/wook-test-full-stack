import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../test-utils';
import Login from '../../src/pages/Login';
import { apiClient } from '../../src/config/axiosInstance';

vi.mock('../../src/config/axiosInstance', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn().mockResolvedValue({ user: null }),
  },
  getApiErrorMessage: (err: unknown) =>
    (err as { message?: string })?.message ?? 'Unexpected error',
}));

const renderLogin = () => render(<Login />, { withAuth: true });

describe('Login page', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.get).mockResolvedValue({ user: null });
  });

  it('renders login form with email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in|login\.submit|submit/i })
    ).toBeInTheDocument();
  });

  it('shows link to register', () => {
    renderLogin();
    expect(screen.getByText(/register|login\.goRegister/i)).toBeInTheDocument();
  });

  it('calls login API on submit', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ jwt: 'token' } as never);

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'user@test.com');
    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(
      screen.getByRole('button', { name: /sign in|login\.submit|submit/i })
    );

    expect(apiClient.post).toHaveBeenCalledWith(
      expect.stringContaining('/login'),
      { user: { email: 'user@test.com', password: 'secret123' } }
    );
  });

  it('shows API error message when login fails', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce({
      message: 'Invalid credentials',
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'user@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(
      screen.getByRole('button', { name: /sign in|login\.submit|submit/i })
    );

    await waitFor(
      () => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
