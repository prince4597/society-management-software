import apiClient from './api-client';
import type { AdminUser, ApiResponse, ProfileResponse } from '@/types';

export interface AuthResponse {
  admin: AdminUser;
  token?: string;
}

export const authService = {
  login: async (data: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post('/admin/auth/login', data);
  },

  logout: async (): Promise<void> => {
    return apiClient.post('/admin/auth/logout');
  },

  getMe: async (): Promise<ApiResponse<ProfileResponse>> => {
    return apiClient.get('/admin/auth/me');
  },
};
