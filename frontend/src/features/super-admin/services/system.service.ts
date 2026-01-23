import apiClient from '@/lib/api-client';
import type {
    ApiResponse,
    SystemHealth,
    GlobalStats,
    ConfigItem,
    Society,
    OnboardSocietyInput,
    OnboardSocietyResponse,
} from '@/types';

export type { SystemHealth, GlobalStats, ConfigItem, Society };

export const systemService = {
    async getHealth(): Promise<ApiResponse<SystemHealth>> {
        const response = await apiClient.get<ApiResponse<SystemHealth>>('/health');
        return response.data;
    },

    async getStats(): Promise<ApiResponse<GlobalStats>> {
        const response = await apiClient.get<ApiResponse<GlobalStats>>('/admin/super/stats');
        return response.data;
    },

    async getConfigs(): Promise<ApiResponse<ConfigItem[]>> {
        const response = await apiClient.get<ApiResponse<ConfigItem[]>>('/admin/super/config');
        return response.data;
    },

    async updateConfig(key: string, value: unknown): Promise<ApiResponse<{ message: string }>> {
        const response = await apiClient.patch<ApiResponse<{ message: string }>>('/admin/super/config', {
            key,
            value,
        });
        return response.data;
    },

    async getSocieties(): Promise<ApiResponse<Society[]>> {
        const response = await apiClient.get<ApiResponse<Society[]>>('/societies');
        return response.data;
    },

    async getSocietyById(id: string): Promise<ApiResponse<Society>> {
        const response = await apiClient.get<ApiResponse<Society>>(`/societies/${id}`);
        return response.data;
    },

    async onboardSociety(data: OnboardSocietyInput): Promise<ApiResponse<OnboardSocietyResponse>> {
        const response = await apiClient.post<ApiResponse<OnboardSocietyResponse>>('/societies', data);
        return response.data;
    },
};