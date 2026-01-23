import { useState, useEffect, useMemo, useCallback } from 'react';
import { systemService } from '../services/system.service';
import type { Society } from '../types';

interface UseSocietiesOptions {
  itemsPerPage?: number;
}

export const useSocieties = (options: UseSocietiesOptions = {}) => {
  const { itemsPerPage = 8 } = options;
  const [societies, setSocieties] = useState<Society[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchSocieties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await systemService.getSocieties();
      if (response.success) {
        setSocieties(response.data);
      } else {
        setError(response.message || 'Failed to sync registry');
      }
    } catch (err) {
      console.error('Failed to fetch societies:', err);
      setError('Network Error: Could not synchronize institutional records');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSocieties();
  }, [fetchSocieties]);

  const filteredSocieties = useMemo(() => {
    return societies.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [societies, searchQuery]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredSocieties.length / itemsPerPage);

  const pagedSocieties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSocieties.slice(start, start + itemsPerPage);
  }, [filteredSocieties, currentPage, itemsPerPage]);

  return {
    societies: pagedSocieties,
    totalCount: filteredSocieties.length,
    allSocieties: societies,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    error,
    refresh: fetchSocieties
  };
};
