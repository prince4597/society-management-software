import apiClient from '@/infrastructure/api/api-client';
import { errorService } from '@/infrastructure/services/error-service';
import type { ApiResponse, PaginatedResult, PaginationParams } from '@/types';
import type { Resident, CreateResidentInput, UpdateResidentInput } from '../types';

export const residentsService = {
  async getResidents(params?: PaginationParams): Promise<PaginatedResult<Resident>> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResult<Resident>>>('/residents', { params });
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async getResidentById(id: string): Promise<Resident> {
    try {
      const response = await apiClient.get<ApiResponse<Resident>>(`/residents/${id}`);
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async createResident(data: CreateResidentInput): Promise<Resident> {
    try {
      const response = await apiClient.post<ApiResponse<Resident>>('/residents', data);
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async updateResident(id: string, data: UpdateResidentInput): Promise<Resident> {
    try {
      const response = await apiClient.patch<ApiResponse<Resident>>(`/residents/${id}`, data);
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async deleteResident(id: string): Promise<void> {
    try {
      await apiClient.delete(`/residents/${id}`);
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  }
};
