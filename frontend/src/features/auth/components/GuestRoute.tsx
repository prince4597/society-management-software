'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PremiumSplash } from '@/components/ui';
import { RoleName } from '@/types';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && user) {
      const redirectPath = user.role === RoleName.SUPER_ADMIN ? '/super-admin' : '/dashboard';
      router.replace(redirectPath);
    }
  }, [status, user, router]);

  if (status === 'loading' || status === 'idle' || status === 'authenticated') {
    return <PremiumSplash />;
  }

  return <>{children}</>;
};
