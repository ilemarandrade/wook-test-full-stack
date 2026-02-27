import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../src/App';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const mockUseAuth = vi.fn();
vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockT = vi.fn((key: string) => key);
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: {} }),
  };
});

const mockUserProfile = {
  id: '1',
  name: 'John',
  lastname: 'Doe',
  email: 'john@test.com',
  document: '123',
  phone: '555',
  lang: 'es',
  role: 'USER',
};
vi.mock('../src/hooks/api/useUserInformation', () => ({
  useUserInformation: () => ({
    data: mockUserProfile,
    isLoading: false,
    refetch: vi.fn(),
  }),
}));

function renderWithRouter(initialEntries: string[] = ['/']) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Routes (public vs protected)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('without auth: navigating to /login shows login page', () => {
    mockUseAuth.mockReturnValue({ token: null, user: null });

    renderWithRouter(['/login']);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in|submit|login/i })).toBeInTheDocument();
  });

  it('without auth: navigating to /register shows register page', () => {
    mockUseAuth.mockReturnValue({ token: null, user: null });

    renderWithRouter(['/register']);

    expect(screen.getByRole('heading', { name: /register\.title|register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('without auth: navigating to /profile redirects to login', () => {
    mockUseAuth.mockReturnValue({ token: null, user: null });

    renderWithRouter(['/profile']);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
  });

  it('without auth: navigating to /user-list redirects to login', () => {
    mockUseAuth.mockReturnValue({ token: null, user: null });

    renderWithRouter(['/user-list']);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('with auth: navigating to /login redirects to profile', () => {
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      user: {
        id: '1',
        name: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        document: '123',
        phone: '555',
        lang: 'es',
        role: 'USER',
      },
    });

    renderWithRouter(['/login']);

    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
  });

  it('with auth: navigating to /profile shows profile page', async () => {
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      user: mockUserProfile,
    });

    renderWithRouter(['/profile']);

    expect(await screen.findByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  });

  it('unknown route redirects to login', () => {
    mockUseAuth.mockReturnValue({ token: null, user: null });

    renderWithRouter(['/unknown-page']);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
