import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  document: string;
  phone: string;
  lang: string | null;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'woow_auth';

function getStoredAuth(): { token: string; user: User } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as { token: string; user: User };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<{ user: User; token: string } | null>(() =>
    getStoredAuth()
  );
  const user = auth?.user ?? null;
  const token = auth?.token ?? null;

  const login = (newToken: string, newUser: User) => {
    setAuth({ token: newToken, user: newUser });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: newToken, user: newUser })
    );
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

