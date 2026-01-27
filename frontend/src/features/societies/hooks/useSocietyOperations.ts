import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { societiesService } from '../api/societies.service';
import type { Society } from '@/types';

export const useSocietyOperations = (id?: string) => {
  const queryClient = useQueryClient();

  const {
    data: society,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['society', id],
    queryFn: () => (id ? societiesService.getSocietyById(id) : null),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Society>) => (id ? societiesService.updateSociety(id, data) : Promise.reject('ID required')),
    onSuccess: (updated) => {
      queryClient.setQueryData(['society', id], updated);
      queryClient.invalidateQueries({ queryKey: ['societies'] });
    },
  });

  const addAdminMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => (id ? societiesService.addAdmin(id, data) : Promise.reject('ID required')),
    onSuccess: () => {
      refetch();
    },
  });

  const updateAdminMutation = useMutation({
    mutationFn: ({ adminId, data }: { adminId: string; data: Partial<Society> }) => societiesService.updateAdmin(adminId, data),
    onSuccess: () => {
      refetch();
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: (adminId: string) => societiesService.deleteAdmin(adminId),
    onSuccess: () => {
      refetch();
    },
  });

  const updateRecords = async (data: Partial<Society>) => {
    try {
      await updateMutation.mutateAsync(data);
      return { success: true };
    } catch (err: unknown) {
      return { success: false, message: err instanceof Error ? err.message : 'Failed to update records' };
    }
  };

  const toggleSocietyStatus = async () => {
    if (!society) return { success: false, message: 'Society not loaded' };
    return updateRecords({ isActive: !society.isActive });
  };

  const addAdministrativeNode = async (formData: Record<string, unknown>) => {
    try {
      await addAdminMutation.mutateAsync(formData);
      return { success: true };
    } catch (err: unknown) {
      return { success: false, message: err instanceof Error ? err.message : 'Failed to register admin' };
    }
  };

  const transitionAdminStatus = async (adminId: string, isActive: boolean) => {
    try {
      await updateAdminMutation.mutateAsync({ adminId, data: { isActive } });
      return { success: true };
    } catch (err: unknown) {
      return { success: false, message: err instanceof Error ? err.message : 'Failed to update admin' };
    }
  };

  const purgeAdminNode = async (adminId: string) => {
    try {
      await deleteAdminMutation.mutateAsync(adminId);
      return { success: true };
    } catch (err: unknown) {
      return { success: false, message: err instanceof Error ? err.message : 'Failed to purge node' };
    }
  };

  return {
    society,
    isLoading,
    isUpdating: updateMutation.isPending || addAdminMutation.isPending || updateAdminMutation.isPending || deleteAdminMutation.isPending,
    updateRecords,
    toggleSocietyStatus,
    addAdministrativeNode,
    transitionAdminStatus,
    purgeAdminNode,
    refresh: refetch,
  };
};
