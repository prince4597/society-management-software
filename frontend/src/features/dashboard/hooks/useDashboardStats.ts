import { useQuery } from '@tanstack/react-query';
import { societiesService } from '../../societies/api/societies.service';

export interface SocietyDashboardStats {
  totalResidents: number;
  totalProperties: number;
  totalFlats: number;
}

export const useDashboardStats = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['society-dashboard-stats'],
    queryFn: () => societiesService.getDashboardStats(),
    staleTime: 30000, // 30 seconds
  });

  return {
    stats,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: refetch,
  };
};
