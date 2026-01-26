import { useState, useEffect, useMemo, useCallback } from 'react';
import { societiesService } from '../api/societies.service';
import { usePagination } from '@/infrastructure/hooks/use-pagination';
import type { Society } from '@/types';

interface UseSocietiesOptions {
  itemsPerPage?: number;
}

export const useSocieties = (options: UseSocietiesOptions = {}) => {
  const { itemsPerPage = 8 } = options;
  const [societies, setSocieties] = useState<Society[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchSocieties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await societiesService.getSocieties();
      setSocieties(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sync registry');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSocieties();
  }, [fetchSocieties]);

  const filteredSocieties = useMemo(() => {
    return societies.filter(
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
    error,
    refresh: fetchSocieties,
  };
};
