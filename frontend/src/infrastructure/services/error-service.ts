import { ApiError } from '../api/api-client';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AppError extends ApiError {
  severity: ErrorSeverity;
  timestamp: string;
}

class ErrorService {
  private static instance: ErrorService;
  private subscribers: ((error: AppError) => void)[] = [];

  private constructor() {}

  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  public subscribe(callback: (error: AppError) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== callback);
    };
  }

  public handleError(error: unknown, severity: ErrorSeverity = 'error'): void {
    const timestamp = new Date().toISOString();

    let appError: AppError;

    if (this.isApiError(error)) {
      appError = {
        ...error,
        severity,
        timestamp,
      };
    } else if (error instanceof Error) {
      appError = {
        message: error.message,
        code: 'CLIENT_ERROR',
        severity,
        timestamp,
      };
    } else {
      appError = {
        message: String(error) || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        severity,
        timestamp,
      };
    }

    console.error(`[ErrorService] [${severity.toUpperCase()}]`, appError);
    this.notifySubscribers(appError);
  }

  private isApiError(error: unknown): error is ApiError {
    return (
      !!error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
    );
  }

  private notifySubscribers(error: AppError): void {
    this.subscribers.forEach((callback) => callback(error));
  }
}

export const errorService = ErrorService.getInstance();
