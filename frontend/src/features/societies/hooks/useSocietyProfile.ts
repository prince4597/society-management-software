import { useState, useEffect } from 'react';
import { societiesService } from '../api/societies.service';
import type { Society } from '@/types';
import { formatPhoneNumber } from '@/infrastructure/utils/formatters';

export const useSocietyProfile = () => {
  const [society, setSociety] = useState<Society | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await societiesService.getMySociety();
      setSociety(data);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        errorObj?.response?.data?.message || errorObj.message || 'Failed to fetch society profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Society>) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await societiesService.updateMySociety(data);
      setSociety(updated);
      setSuccess('Society profile updated successfully');
      return { success: true, data: updated };
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        errorObj?.response?.data?.message || errorObj.message || 'Failed to update society profile';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    society,
    isLoading,
    isUpdating,
    error,
    success,
    updateProfile,
    refresh: fetchProfile,
    formatPhone: formatPhoneNumber,
  };
};
