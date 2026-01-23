import { useState } from 'react';
import { systemService } from '../services/system.service';
import type { OnboardSocietyInput } from '../types';
import type { ApiError } from '@/lib/api-client';

export const useOnboardSociety = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onboard = async (data: {
    society: {
      name: string;
      code: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      email?: string;
      phone?: string;
      totalFlats?: string;
    };
    admin: Record<string, unknown>;
  }) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const input: OnboardSocietyInput = {
      society: {
        name: data.society.name,
        code: data.society.code,
        address: data.society.address,
        city: data.society.city,
        state: data.society.state,
        zipCode: data.society.zipCode,
        email: data.society.email || undefined,
        phone: data.society.phone,
        totalFlats: data.society.totalFlats ? parseInt(data.society.totalFlats, 10) : 0,
      },
      admin: data.admin as OnboardSocietyInput['admin'],
    };

    try {
      const response = await systemService.onboardSociety(input);

      if (response.success) {
        setSuccess(
          `Society "${response.data.society.name}" onboarded successfully with admin ${response.data.admin.email}`
        );
        onSuccess?.();
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message || 'Failed to onboard society' };
    } catch (err) {
      const apiError = err as ApiError;
      const msg = apiError.message || 'Failed to onboard society';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    const limited = digits.slice(0, 12);
    if (limited.length <= 2) return `+${limited}`;
    return `+${limited.slice(0, 2)} ${limited.slice(2)}`;
  };

  return {
    onboard,
    formatPhone,
    isLoading,
    error,
    success,
    setError,
    setSuccess
  };
};
