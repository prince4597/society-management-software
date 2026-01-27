import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesService } from '../api/properties.service';
import { Flat, CreateFlatInput, UpdateFlatInput } from '../types';
import { PaginationParams } from '@/types';

export const useProperties = (initialParams?: PaginationParams) => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<PaginationParams>(initialParams || { page: 1, limit: 100 });

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['properties', params],
    queryFn: () => propertiesService.getProperties(params),
    staleTime: 60000, // 1 minute
  });

  const properties = data?.data || [];
  const meta = data?.meta;

  const createMutation = useMutation({
    mutationFn: (data: CreateFlatInput) => propertiesService.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFlatInput }) =>
      propertiesService.updateProperty(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.setQueryData(['property', updated.id], updated);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertiesService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  return {
    properties,
    meta,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
    setParams,
    params,
    createProperty: createMutation.mutateAsync,
    updateProperty: updateMutation.mutateAsync,
    deleteProperty: deleteMutation.mutateAsync,
    isProcessing: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
};
