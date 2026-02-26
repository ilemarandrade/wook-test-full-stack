import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';
import { AuthProvider } from '../context/AuthContext';
import { apiClient } from '../config/axiosInstance';

vi.mock('../config/axiosInstance', () => ({
  apiClient: { put: vi.fn() },
}));

const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

describe('Profile page', () => {
  beforeEach(() => {
    (apiClient.put as unknown as ReturnType<typeof vi.fn>).mockReset?.();
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

  it('renders profile form with user data', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <Profile />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
