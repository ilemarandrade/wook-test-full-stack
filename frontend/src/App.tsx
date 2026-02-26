import React from 'react';
import { Link } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import AppRoutes from './Routes';

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
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </AuthProvider>
  );
};

export default App;

