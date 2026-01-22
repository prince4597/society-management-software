'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import type { AdminUser } from '@/types';
import { PremiumSplash } from '@/components/ui';

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

  // Session Refresh
  useEffect(() => {
    if (status === 'idle') {
      refreshUser();
    }
  }, [status, refreshUser]);

  const login = useCallback((userData: AdminUser) => {
    setUser(userData);
    setStatus('authenticated');
    setError(null);
    const redirectPath = userData.role === 'SUPER_ADMIN' ? '/super-admin' : '/dashboard';
    router.push(redirectPath);
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
      {status === 'loading' ? (
        <PremiumSplash />
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
