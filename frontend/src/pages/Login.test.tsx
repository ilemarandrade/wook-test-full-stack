import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import { apiClient } from '../config/axiosInstance';

vi.mock('../config/axiosInstance', () => ({
  apiClient: { post: vi.fn() },
}));

const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

const renderLogin = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );

describe('Login page', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  it('renders login form with email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows link to register', () => {
    renderLogin();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('calls login API on submit', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ jwt: 'token' } as any);

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'user@test.com');
    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(apiClient.post).toHaveBeenCalledWith(
      expect.stringContaining('/login'),
      { user: { email: 'user@test.com', password: 'secret123' } }
    );
  });
});
