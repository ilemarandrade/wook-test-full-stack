import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';

const TestConsumer: React.FC = () => {
  const { user, token, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'none'}</span>
      <span data-testid="token">{token ? 'has-token' : 'none'}</span>
      <button
        type="button"
        onClick={() =>
          login('fake-jwt', {
            id: '1',
            name: 'John',
            lastname: 'Doe',
            email: 'john@test.com',
            document: '123',
            phone: '555',
            lang: 'en',
            role: 'USER',
          })
        }
      >
        Login
      </button>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides null user and token initially', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('token')).toHaveTextContent('none');
  });

  it('login updates state and persists to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      await user.click(screen.getByText('Login'));
    });

    expect(screen.getByTestId('user')).toHaveTextContent('john@test.com');
    expect(screen.getByTestId('token')).toHaveTextContent('has-token');
    expect(localStorage.getItem('woow_auth')).toBeTruthy();
  });

  it('logout clears state and localStorage', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      await user.click(screen.getByText('Login'));
    });
    expect(screen.getByTestId('user')).toHaveTextContent('john@test.com');

    await act(async () => {
      await user.click(screen.getByText('Logout'));
    });
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('token')).toHaveTextContent('none');
    expect(localStorage.getItem('woow_auth')).toBeNull();
  });

  it('restores auth from localStorage on mount', () => {
    const stored = {
      token: 'stored-token',
      user: {
        id: '2',
        name: 'Jane',
        lastname: 'Doe',
        email: 'jane@test.com',
        document: '456',
        phone: '555',
        lang: 'en',
        role: 'USER',
      },
    };
    localStorage.setItem('woow_auth', JSON.stringify(stored));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('jane@test.com');
    expect(screen.getByTestId('token')).toHaveTextContent('has-token');
  });
});
