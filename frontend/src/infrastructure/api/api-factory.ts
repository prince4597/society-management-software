import apiClient from './api-client';

export interface BaseApi<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * API Factory to create standardized CRUD services
 * Reduces boilerplate and ensures consistent error handling across features
 */
export const createApiService = <T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>>(
  resourcePath: string
): BaseApi<T, CreateDTO, UpdateDTO> => {
  return {
    findAll: async (): Promise<T[]> => {
      const response = await apiClient.get(resourcePath);
      return response.data.data;
    },
    findById: async (id: string): Promise<T> => {
      const response = await apiClient.get(`${resourcePath}/${id}`);
      return response.data.data;
    },
    create: async (data: CreateDTO): Promise<T> => {
      const response = await apiClient.post(resourcePath, data);
      return response.data.data;
    },
    update: async (id: string, data: UpdateDTO): Promise<T> => {
      const response = await apiClient.patch(`${resourcePath}/${id}`, data);
      return response.data.data;
    },
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`${resourcePath}/${id}`);
    },
  };
};
