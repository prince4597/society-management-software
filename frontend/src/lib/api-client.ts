import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ApiError {
    message: string;
    code?: string;
    errors?: Record<string, string[]>;
}

/**
 * Standardized API Client
 * Uses axios for robust HTTP communication with interceptors for auth and error normalization.
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

// Request Interceptor: Inject Authorization Bearer
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get('admin_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

interface BackendErrorResponse {
    message?: string;
    code?: string;
    errors?: Record<string, string[]>;
}

// Response Interceptor: Normalize Errors
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<BackendErrorResponse>) => {
        const data = error.response?.data;
        const apiError: ApiError = {
            message: data?.message || error.message || 'Network error occurred',
            code: data?.code || 'FETCH_ERROR',
            errors: data?.errors,
        };

        if (error.response?.status === 401) {
            // Global 401 handling (e.g., event emitter for logout) could go here
        }

        return Promise.reject(apiError);
    }
);

export default apiClient;
