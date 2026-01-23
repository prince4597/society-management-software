import { useState, useCallback } from 'react';
import { authService } from '../api/auth.service';
import { useAuth } from '@/providers/AuthProvider';

export const useAuthFlow = () => {
  const { login: setAuthUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      if (response.success && response.data.admin) {
        setAuthUser(response.data.admin);
        return { success: true };
      }
      throw new Error('Authentication failed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [setAuthUser]);

  return {
    error,
    isLoading,
    handleLogin,
    setError
  };
};
