import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { societiesService } from '../api/societies.service';
import { usePagination } from '@/infrastructure/hooks/use-pagination';

interface UseSocietiesOptions {
  itemsPerPage?: number;
}

export const useSocieties = (options: UseSocietiesOptions = {}) => {
  const { itemsPerPage = 8 } = options;
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: societies = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['societies'],
    queryFn: () => societiesService.getSocieties(),
  });

  const filteredSocieties = useMemo(() => {
    return (societies || []).filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [societies, searchQuery]);

  const { currentPage, totalPages, pagedData, setPage, resetToFirstPage, totalItems } =
    usePagination({ data: filteredSocieties, itemsPerPage });

  useEffect(() => {
    resetToFirstPage();
  }, [searchQuery, resetToFirstPage]);

  return {
    societies: pagedData,
    totalCount: totalItems,
    allSocieties: societies,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage: setPage,
    totalPages,
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
  };
};
