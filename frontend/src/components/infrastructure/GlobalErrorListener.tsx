'use client';

import { useEffect } from 'react';
import { errorService } from '@/infrastructure/services/error-service';
import { useToast } from '@/providers/ToastProvider';

/**
 * Bridges the gap between the headless ErrorService and the Toast UI.
 * This component remains silent and only listens for global error events.
 */
export const GlobalErrorListener = () => {
  const { error: showToast } = useToast();

  useEffect(() => {
    const unsubscribe = errorService.subscribe((error) => {
      // Don't show toast for "FETCH_ERROR" if it's just a common 401 during auth check
      // (The specialized service or interceptor should handle UX if needed)
      if (error.code === 'FETCH_ERROR' && error.message.includes('auth')) {
        return;
      }

      showToast(error.message);
    });

    return unsubscribe;
  }, [showToast]);

  return null;
};
