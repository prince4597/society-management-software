import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      code: error.response?.data?.code || 'INTERNAL_ERROR',
      errors: error.response?.data?.errors,
    };

    if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      // Logic for 401 handling can be piped here if needed
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
