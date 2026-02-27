import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useUserInformation } from '../hooks/api';

export interface User {
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
  login: (token: string, user?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'woow_auth';

type StoredAuth = {
  token: string;
  user?: User;
};

function getStoredAuth(): StoredAuth | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StoredAuth;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {data: userInformation} = useUserInformation();
  const [auth, setAuth] = useState<StoredAuth | null>(() => getStoredAuth());
  const user = auth?.user ?? null;
  const token = auth?.token ?? null;

  const login = useCallback((newToken: string, newUser?: User) => {
    const nextAuth: StoredAuth = newUser
      ? { token: newToken, user: newUser }
      : { token: newToken };

    setAuth(nextAuth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (userInformation) {
      setAuth({
        user: {...userInformation},
        token: getStoredAuth()?.token ?? '',
      });
    }
  }, [userInformation]);

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

