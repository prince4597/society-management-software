'use client';

import { useState, useMemo, useCallback } from 'react';

interface PaginationOptions<T> {
  data: T[];
  itemsPerPage?: number;
}

export const usePagination = <T>({ data, itemsPerPage = 8 }: PaginationOptions<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    pagedData,
    setPage,
    resetToFirstPage,
    totalItems: data.length,
  };
};
