import { createApiService } from '@/infrastructure/api/api-factory';
import { Flat } from '../types';

export const propertyApi = createApiService<Flat>('/properties');

