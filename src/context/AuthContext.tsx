import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { User } from '@/types';
import { authApi } from '@/api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    confirm_password: string;
    full_name: string;
    role?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load user from storage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearAuthData();
      }
    }
    setIsLoading(false);
  }, []);

  // Set up periodic token refresh
  useEffect(() => {
    if (user) {
      refreshTimerRef.current = setInterval(async () => {
        try {
          await refreshSession();
        } catch {
          // Silent fail - will be caught on next API call
        }
      }, REFRESH_THRESHOLD);
    }
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [user]);

  const clearAuthData = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await authApi.refreshToken(refreshToken);
      const { access_token, refresh_token: newRefreshToken } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', newRefreshToken);
      return true;
    } catch {
      clearAuthData();
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const { access_token, refresh_token, user: userData } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    confirm_password: string;
    full_name: string;
    role?: string;
  }) => {
    const response = await authApi.register(data);
    const { access_token, refresh_token, user: userData } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Proceed with local logout even if API call fails
      }
    }
    clearAuthData();
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authApi.logoutAll();
    } catch {
      // Proceed with local logout even if API call fails
    }
    clearAuthData();
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        logoutAll,
        refreshSession,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};