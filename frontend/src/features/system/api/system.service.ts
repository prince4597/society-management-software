import apiClient from '@/infrastructure/api/api-client';
import { errorService } from '@/infrastructure/services/error-service';
import type { ApiResponse, SystemHealth, GlobalStats, ConfigItem } from '@/types';

export const systemService = {
  async getHealth(): Promise<SystemHealth> {
    try {
      const response = await apiClient.get<ApiResponse<SystemHealth>>('/health');
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async getStats(): Promise<GlobalStats> {
    try {
      const response = await apiClient.get<ApiResponse<GlobalStats>>('/admin/super/stats');
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async getConfigs(): Promise<ConfigItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<ConfigItem[]>>('/admin/super/config');
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async getDashboardData(): Promise<{
    stats: GlobalStats;
    configs: ConfigItem[];
    health: SystemHealth;
  }> {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          stats: GlobalStats;
          configs: ConfigItem[];
          health: SystemHealth;
        }>
      >('/admin/super/dashboard');
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async updateConfig(key: string, value: unknown): Promise<{ message: string }> {
    try {
      const response = await apiClient.patch<ApiResponse<{ message: string }>>(
        '/admin/super/config',
        {
          key,
          value,
        }
      );
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },
};
