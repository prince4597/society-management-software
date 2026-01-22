'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/api/auth.service';
import type { AdminUser } from '@/types';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

interface AuthContextType {
  user: AdminUser | null;
  status: AuthStatus;
  error: string | null;
  login: (userData: AdminUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleUnauthenticated = useCallback(() => {
    setUser(null);
    setStatus('unauthenticated');
    if (!PUBLIC_ROUTES.includes(pathname)) {
      router.push('/login');
    }
  }, [pathname, router]);

  const refreshUser = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await authService.getMe();
      if (response.success && response.data.admin) {
        setUser(response.data.admin);
        setStatus('authenticated');
        setError(null);
      } else {
        handleUnauthenticated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Session expired');
      handleUnauthenticated();
    }
  }, [handleUnauthenticated]);

  useEffect(() => {
    if (status === 'idle') {
      refreshUser();
    }
  }, [status, refreshUser]);

  // Route Guarding
  useEffect(() => {
    if (status === 'unauthenticated' && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/login');
    }
    if (status === 'authenticated' && pathname === '/login') {
      router.push('/dashboard');
    }
  }, [status, pathname, router]);

  const login = useCallback((userData: AdminUser) => {
    setUser(userData);
    setStatus('authenticated');
    setError(null);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      handleUnauthenticated();
    }
  }, [handleUnauthenticated]);

  const value = useMemo(() => ({
    user,
    status,
    error,
    login,
    logout,
    refreshUser
  }), [user, status, error, login, logout, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {status === 'loading' && !PUBLIC_ROUTES.includes(pathname) ? (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-medium animate-pulse">Securing session...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
