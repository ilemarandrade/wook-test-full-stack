import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from '../../../src/components/PublicRoute';

const mockUseAuth = vi.fn();
vi.mock('../../../src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

const ProfilePage: React.FC = () => <div>Profile page</div>;
const LoginPage: React.FC = () => <div>Login page</div>;
const PublicChild: React.FC = () => <div>Public child content</div>;

describe('PublicRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /profile when token is present', () => {
    mockUseAuth.mockReturnValue({ token: 'some-token' });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Profile page')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });

  it('renders children when token is null', () => {
    mockUseAuth.mockReturnValue({ token: null });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<PublicRoute><PublicChild /></PublicRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Public child content')).toBeInTheDocument();
  });

  it('renders Outlet when no children and token is null', () => {
    mockUseAuth.mockReturnValue({ token: null });

    const OutletContent: React.FC = () => <div>Outlet content</div>;

    render(
      <MemoryRouter initialEntries={['/public']}>
        <Routes>
          <Route path="/public" element={<PublicRoute />}>
            <Route index element={<OutletContent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Outlet content')).toBeInTheDocument();
  });
});
