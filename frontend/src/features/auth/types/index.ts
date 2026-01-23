import type { AdminUser } from '@/types';

export interface AuthResponse {
  admin: AdminUser;
  token?: string;
}

export interface ProfileResponse {
  admin: AdminUser;
}
