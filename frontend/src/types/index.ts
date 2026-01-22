/**
 * Centralized type definitions for the frontend application.
 * These types mirror the backend API response structures.
 */

// ============================================================================
// User/Admin Types
// ============================================================================

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  lastLogin: string | null;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// ============================================================================
// Auth-specific Response Types
// ============================================================================

export interface AuthResponse {
  admin: AdminUser;
  token?: string;
}

export interface ProfileResponse {
  admin: AdminUser;
}
