import apiClient from '@/lib/api-client';
import type { ApiResponse, AdminUser } from '@/types';
import type {
    SystemHealth,
    GlobalStats,
    ConfigItem,
    Society,
    OnboardSocietyInput,
    OnboardSocietyResponse,
} from '../types';

export type { SystemHealth, GlobalStats, ConfigItem, Society, AdminUser };

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

    async getDashboardData(): Promise<ApiResponse<{
        stats: GlobalStats;
        configs: ConfigItem[];
        health: SystemHealth;
    }>> {
        const response = await apiClient.get<ApiResponse<{
            stats: GlobalStats;
            configs: ConfigItem[];
            health: SystemHealth;
        }>>('/admin/super/dashboard');
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

    async updateSociety(id: string, data: Partial<Society>): Promise<ApiResponse<Society>> {
        const response = await apiClient.patch<ApiResponse<Society>>(`/societies/${id}`, data);
        return response.data;
    },

    // Standardizing on /admin/super prefixes for all management actions to avoid 404s
    async updateAdmin(adminId: string, data: Partial<AdminUser>): Promise<ApiResponse<AdminUser>> {
        const response = await apiClient.patch<ApiResponse<AdminUser>>(`/admin/super/admins/${adminId}`, data);
        return response.data;
    },

    async deleteAdmin(adminId: string): Promise<ApiResponse<{ message: string }>> {
        const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/admin/super/admins/${adminId}`);
        return response.data;
    },

    async addAdmin(societyId: string, data: Record<string, unknown>): Promise<ApiResponse<AdminUser>> {
        const response = await apiClient.post<ApiResponse<AdminUser>>(`/admin/super/societies/${societyId}/admins`, data);
        return response.data;
    },
};