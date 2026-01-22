import apiClient from '@/lib/api-client';
import type { ApiResponse } from '@/types';

export interface HealthCheck {
    status: 'up' | 'down';
    latency?: number;
    message?: string;
}

export interface MemoryCheck {
    status: 'up' | 'warning';
    heapUsed: number;
    heapTotal: number;
    rss: number;
    percentage: number;
}

export interface SystemInfo {
    platform: string;
    cpuModel: string;
    cpus: number;
    loadAvg: number[];
}

export interface SocketMetrics {
    totalConnections: number;
    adminConnections: number;
}

export interface SystemHealth {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version: string;
    uptime: number;
    timestamp: string;
    checks: {
        database: HealthCheck;
        memory: MemoryCheck;
    };
    system: SystemInfo;
    sockets: SocketMetrics;
}

export interface GlobalStats {
    totalAdmins: number;
    totalRoles: number;
    totalSocieties: number;
    totalUsers: number;
    activeConnections: number;
    adminConnections: number;
    timestamp: string;
}

export interface ConfigItem {
    id: string;
    key: string;
    value: unknown;
    description?: string;
    isPublic: boolean;
}

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
        const response = await apiClient.patch<ApiResponse<{ message: string }>>('/admin/super/config', { key, value });
        return response.data;
    }
};
