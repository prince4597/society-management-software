import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { residentsService } from '../api/residents.service';
import { Resident, CreateResidentInput, UpdateResidentInput } from '../types';
import { PaginationParams } from '@/types';

export const useResidents = (initialParams?: PaginationParams) => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<PaginationParams>(initialParams || { page: 1, limit: 100 });

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['residents', params],
    queryFn: () => residentsService.getResidents(params),
    staleTime: 60000, // 1 minute
  });

  const residents = data?.data || [];
  const meta = data?.meta;

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
    meta,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
    setParams,
    params,
    createResident: createMutation.mutateAsync,
    updateResident: updateMutation.mutateAsync,
    deleteResident: deleteMutation.mutateAsync,
    isProcessing: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
};
