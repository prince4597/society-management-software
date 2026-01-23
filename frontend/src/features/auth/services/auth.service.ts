import apiClient from '@/lib/api-client';
import type { ApiResponse, AdminUser } from '@/types';
import type { AuthResponse, ProfileResponse } from '../types';

export const authService = {
    async login(data: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
        const response = await apiClient.post<ApiResponse<AuthResponse>>('/admin/auth/login', data);
        return response.data;
    },

    async logout(): Promise<ApiResponse<void>> {
        const response = await apiClient.post<ApiResponse<void>>('/admin/auth/logout');
        return response.data;
    },

    async getMe(): Promise<ApiResponse<ProfileResponse>> {
        const response = await apiClient.get<ApiResponse<ProfileResponse>>('/admin/auth/me');
        return response.data;
    },

    async updateProfile(data: Partial<AdminUser>): Promise<ApiResponse<{ admin: AdminUser }>> {
        const response = await apiClient.patch<ApiResponse<{ admin: AdminUser }>>('/admin/auth/profile', data);
        return response.data;
    },
};
