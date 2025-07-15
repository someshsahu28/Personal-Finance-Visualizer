'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const email = localStorage.getItem('userEmail');
      const name = localStorage.getItem('userName');

      if (authStatus === 'true' && email) {
        setIsAuthenticated(true);
        setUserEmail(email);
        setUserName(name);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (email: string, name?: string) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    if (name) {
      localStorage.setItem('userName', name);
    }
    
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserName(name || null);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserName(null);
    
    router.push('/signin');
  };

  const value = {
    isAuthenticated,
    userEmail,
    userName,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
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
