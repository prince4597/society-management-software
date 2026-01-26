'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PremiumSplash } from '@/components/ui';
import { RoleName } from '@/types';

export default function RootPage() {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && user) {
      const redirectPath = user.role === RoleName.SUPER_ADMIN ? '/super-admin' : '/dashboard';
      router.replace(redirectPath);
    } else if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [user, status, router]);

  return <PremiumSplash />;
}
