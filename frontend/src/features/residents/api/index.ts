import { createApiService } from '@/infrastructure/api/api-factory';
import { Resident } from '../types';

export const residentApi = createApiService<Resident>('/residents');

