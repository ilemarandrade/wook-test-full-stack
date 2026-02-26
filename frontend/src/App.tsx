import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="text-sm font-semibold">
            Woow Test
          </Link>
          <nav className="flex gap-4 text-sm text-slate-300">
            {user ? (
              <>
                <Link to="/profile">Profile</Link>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={<Navigate to="/login" replace />}
    />
    <Route
      path="/login"
      element={
        <Layout>
          <Login />
        </Layout>
      }
    />
    <Route
      path="/register"
      element={
        <Layout>
          <Register />
        </Layout>
      }
    />
    <Route
      path="/profile"
      element={
        <Layout>
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Layout>
      }
    />
    <Route
      path="*"
      element={<Navigate to="/login" replace />}
    />
  </Routes>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;

