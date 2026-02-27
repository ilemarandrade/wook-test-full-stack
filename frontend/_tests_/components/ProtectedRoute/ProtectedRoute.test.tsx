import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../../src/components/ProtectedRoute';

const mockUseAuth = vi.fn();
vi.mock('../../../src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

const LoginPage: React.FC = () => <div>Login page</div>;
const ProfilePage: React.FC = () => <div>Profile page</div>;
const ProtectedContent: React.FC = () => <div>Protected content</div>;
const AdminContent: React.FC = () => <div>Admin content</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ token: null, user: null });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
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

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });

  it('redirects to /profile when token is present but user role is not in requiredRoles', () => {
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

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <AdminContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Profile page')).toBeInTheDocument();
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });

  it('renders Outlet when no children are passed', () => {
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

    const OutletContent: React.FC = () => <div>Outlet content</div>;

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<OutletContent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Outlet content')).toBeInTheDocument();
  });
});
