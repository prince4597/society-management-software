import { ApiResponse, ApiErrorResponse } from '../types';

export const createSuccessResponse = <T>(
  requestId: string,
  data: T,
  message?: string
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  requestId,
  timestamp: new Date().toISOString(),
});

export const createErrorResponse = (
  requestId: string,
  code: string,
  message: string,
  errors?: Record<string, string[]>
): ApiErrorResponse => ({
  success: false,
  code,
  message,
  requestId,
  timestamp: new Date().toISOString(),
  errors,
});

export const getRequestId = (req: { context?: { requestId?: string } }): string =>
  req.context?.requestId ?? 'unknown';
