'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  roles: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login for now
    const mockUser: AuthUser = {
      id: '1',
      email,
      name: 'Test User',
      roles: ['user']
    };
    setUser(mockUser);
  };

  const register = async (email: string, password: string, name?: string) => {
    // Mock register for now
    const mockUser: AuthUser = {
      id: '1',
      email,
      name: name || 'Test User',
      roles: ['user']
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const contextValue = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}