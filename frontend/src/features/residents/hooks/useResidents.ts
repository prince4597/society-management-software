import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { residentsService } from '../api/residents.service';
import { Resident, CreateResidentInput, UpdateResidentInput } from '../types';

export const useResidents = () => {
  const queryClient = useQueryClient();

  const {
    data: residents = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['residents'],
    queryFn: () => residentsService.getResidents(),
    staleTime: 60000, // 1 minute
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateResidentInput) => residentsService.createResident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResidentInput }) =>
      residentsService.updateResident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => residentsService.deleteResident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });

  return {
    residents,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
    createResident: createMutation.mutateAsync,
    updateResident: updateMutation.mutateAsync,
    deleteResident: deleteMutation.mutateAsync,
    isProcessing: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
};
