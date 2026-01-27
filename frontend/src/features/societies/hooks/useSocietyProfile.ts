import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { societiesService } from '../api/societies.service';
import type { Society } from '@/types';
import { formatPhoneNumber } from '@/infrastructure/utils/formatters';

export const useSocietyProfile = () => {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);

  const {
    data: society,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['society-profile'],
    queryFn: () => societiesService.getMySociety(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Society>) => societiesService.updateMySociety(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['society-profile'], updated);
      setSuccess('Society profile updated successfully');
      // Clear success after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    },
  });

  const updateProfile = async (data: Partial<Society>) => {
    try {
      const result = await updateMutation.mutateAsync(data);
      return { success: true, data: result };
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to update society profile',
      };
    }
  };

  return {
    society,
    isLoading,
    isUpdating: updateMutation.isPending,
    error: (error instanceof Error ? error.message : null) || (updateMutation.error instanceof Error ? updateMutation.error.message : null),
    success,
    updateProfile,
    refresh: refetch,
    formatPhone: formatPhoneNumber,
  };
};
