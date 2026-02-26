import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';
import { AuthProvider } from '../context/AuthContext';

describe('Profile page', () => {
  beforeEach(() => {
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
      <MemoryRouter>
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
