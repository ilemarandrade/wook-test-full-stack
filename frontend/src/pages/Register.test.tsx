import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

const renderRegister = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe('Register page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register form with required fields', () => {
    renderRegister();
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/document/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows link to login', () => {
    renderRegister();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });
});
