import apiClient from '@/infrastructure/api/api-client';
import { Resident } from '../types';

export const residentApi = {
    findAll: async (): Promise<Resident[]> => {
        const response = await apiClient.get('/residents');
        return response.data.data;
    },
    findById: async (id: string): Promise<Resident> => {
        const response = await apiClient.get(`/residents/${id}`);
        return response.data.data;
    },
    create: async (data: Partial<Resident>): Promise<Resident> => {
        const response = await apiClient.post('/residents', data);
        return response.data.data;
    },
    update: async (id: string, data: Partial<Resident>): Promise<Resident> => {
        const response = await apiClient.put(`/residents/${id}`, data);
        return response.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/residents/${id}`);
    },
};
