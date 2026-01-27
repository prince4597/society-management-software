import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesService } from '../api/properties.service';
import { Flat, CreateFlatInput, UpdateFlatInput } from '../types';

export const useProperties = () => {
  const queryClient = useQueryClient();

  const {
    data: properties = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertiesService.getProperties(),
    staleTime: 60000, // 1 minute
  });

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
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
    createProperty: createMutation.mutateAsync,
    updateProperty: updateMutation.mutateAsync,
    deleteProperty: deleteMutation.mutateAsync,
    isProcessing: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
};
