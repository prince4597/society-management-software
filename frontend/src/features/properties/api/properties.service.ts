import apiClient from '@/infrastructure/api/api-client';
import { errorService } from '@/infrastructure/services/error-service';
import type { ApiResponse, PaginatedResult, PaginationParams } from '@/types';
import type { Flat, CreateFlatInput, UpdateFlatInput } from '../types';

export const propertiesService = {
  async getProperties(params?: PaginationParams): Promise<PaginatedResult<Flat>> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResult<Flat>>>('/properties', { params });
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async getPropertyById(id: string): Promise<Flat> {
    try {
      const response = await apiClient.get<ApiResponse<Flat>>(`/properties/${id}`);
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async createProperty(data: CreateFlatInput): Promise<Flat> {
    try {
      const response = await apiClient.post<ApiResponse<Flat>>('/properties', data);
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async updateProperty(id: string, data: UpdateFlatInput): Promise<Flat> {
    try {
      const response = await apiClient.patch<ApiResponse<Flat>>(`/properties/${id}`, data);
      return response.data.data;
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  },

  async deleteProperty(id: string): Promise<void> {
    try {
      await apiClient.delete(`/properties/${id}`);
    } catch (error) {
      errorService.handleError(error, 'error');
      throw error;
    }
  }
};
