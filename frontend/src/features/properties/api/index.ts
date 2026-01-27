import apiClient from '@/infrastructure/api/api-client';
import { Flat } from '../types';

export const propertyApi = {
    findAll: async (): Promise<Flat[]> => {
        const response = await apiClient.get('/properties');
        return response.data.data;
    },
    findById: async (id: string): Promise<Flat> => {
        const response = await apiClient.get(`/properties/${id}`);
        return response.data.data;
    },
    create: async (data: Partial<Flat>): Promise<Flat> => {
        const response = await apiClient.post('/properties', data);
        return response.data.data;
    },
    update: async (id: string, data: Partial<Flat>): Promise<Flat> => {
        const response = await apiClient.put(`/properties/${id}`, data);
        return response.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/properties/${id}`);
    },
};
