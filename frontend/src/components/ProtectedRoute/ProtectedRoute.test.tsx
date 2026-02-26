import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './index';
import { AuthProvider } from '../../context/AuthContext';

const ProtectedPage: React.FC = () => <div>Protected content</div>;
const LoginPage: React.FC = () => <div>Login page</div>;

const TestApp: React.FC<{ initialRoute: string }> = ({ initialRoute }) => (
  <MemoryRouter initialEntries={[initialRoute]}>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <ProtectedPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </MemoryRouter>
);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects to /login when user is not authenticated', () => {
    render(<TestApp initialRoute="/protected" />);
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
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

    render(<TestApp initialRoute="/protected" />);
    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });
});
