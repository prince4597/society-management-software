'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { PremiumSplash } from '@/components/ui';
import { RoleName } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: RoleName;
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated' && user) {
      if (allowedRole && user.role !== allowedRole) {
        // Redirect if role doesn't match
        const redirectPath = user.role === RoleName.SUPER_ADMIN ? '/super-admin' : '/dashboard';
        if (pathname !== redirectPath) {
          router.replace(redirectPath);
        }
      }
    }
  }, [status, user, allowedRole, router, pathname]);

  // Show premium splash while loading or while unauthorized (before redirect)
  if (status === 'loading' || status === 'idle' || status === 'unauthenticated') {
    return <PremiumSplash />;
  }

  // If role is specified and doesn't match, return null while redirecting
  if (status === 'authenticated' && user && allowedRole && user.role !== allowedRole) {
    return <PremiumSplash />;
  }

  return <>{children}</>;
};
