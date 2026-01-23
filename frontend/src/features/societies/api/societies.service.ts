import apiClient from '@/infrastructure/api/api-client';
import { errorService } from '@/infrastructure/services/error-service';
import type { ApiResponse, Society, AdminUser } from '@/types';
import type { OnboardSocietyInput, OnboardSocietyResponse } from '../types';

export const societiesService = {
    async getSocieties(): Promise<Society[]> {
        try {
            const response = await apiClient.get<ApiResponse<Society[]>>('/societies');
            return response.data.data;
        } catch (error) {
            errorService.handleError(error, 'error');
            throw error;
        }
    },

    async getSocietyById(id: string): Promise<Society> {
        try {
            const response = await apiClient.get<ApiResponse<Society>>(`/societies/${id}`);
            return response.data.data;
        } catch (error) {
            errorService.handleError(error, 'error');
            throw error;
        }
    },

    async onboardSociety(data: OnboardSocietyInput): Promise<OnboardSocietyResponse> {
        try {
            const response = await apiClient.post<ApiResponse<OnboardSocietyResponse>>('/societies', data);
            return response.data.data;
        } catch (error) {
            errorService.handleError(error, 'error');
            throw error;
        }
    },

    async updateSociety(id: string, data: Partial<Society>): Promise<Society> {
        try {
            const response = await apiClient.patch<ApiResponse<Society>>(`/societies/${id}`, data);
            return response.data.data;
        } catch (error) {
            errorService.handleError(error, 'error');
            throw error;
        }
    },

    async updateAdmin(adminId: string, data: Partial<AdminUser>): Promise<AdminUser> {
        try {
            const response = await apiClient.patch<ApiResponse<AdminUser>>(`/admin/super/admins/${adminId}`, data);
            return response.data.data;
        } catch (error) {
            errorService.handleError(error, 'error');
            throw error;
        }
    },

    async deleteAdmin(adminId: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/admin/super/admins/${adminId}`);
            return response.data.data;
        } catch (error) {
            errorService.handleError(error, 'error');
            throw error;
        }
    },

    async addAdmin(societyId: string, data: Record<string, unknown>): Promise<AdminUser> {
        try {
            const response = await apiClient.post<ApiResponse<AdminUser>>(`/admin/super/societies/${societyId}/admins`, data);
            return response.data.data;
        } catch (error) {
            errorService.handleError(error, 'error');
            throw error;
        }
    },
};
