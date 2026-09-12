import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AuthState } from '../types';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '../lib/api';

interface AuthContextType extends AuthState {
  login: (credentials: { email?: string; identifier?: string; username?: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: AdminUser) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verifyAuth() {
      const existingToken = getAuthToken();
      if (!existingToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { user } = await api.getMe();
        setAdmin(user);
        setToken(existingToken);
      } catch {
        clearAuthToken();
        setToken(null);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, []);

  const login = async (credentials: { email?: string; identifier?: string; username?: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await api.login(credentials);
      if (res.token && res.user) {
        setAuthToken(res.token);
        setToken(res.token);
        setAdmin(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthToken();
    setToken(null);
    setAdmin(null);
  };

  const updateUser = (user: AdminUser) => {
    setAdmin(user);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token && !!admin,
        login,
        logout,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
