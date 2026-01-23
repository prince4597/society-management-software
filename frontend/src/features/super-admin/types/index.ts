import type { AdminUser } from '@/types';
export type { AdminUser };

export interface Society {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  email?: string;
  phone?: string;
  totalFlats: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  admins?: AdminUser[];
}

export interface OnboardSocietyInput {
  society: {
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    country?: string;
    zipCode: string;
    email?: string;
    phone?: string;
    totalFlats?: number;
  };
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  };
}

export interface OnboardSocietyResponse {
  society: Society;
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface HealthCheck {
  status: 'up' | 'down';
  latency?: number;
  message?: string;
}

export interface MemoryCheck {
  status: 'up' | 'warning';
  heapUsed: number;
  heapTotal: number;
  rss: number;
  percentage: number;
}

export interface SystemInfo {
  platform: string;
  cpuModel: string;
  cpus: number;
  loadAvg: number[];
}

export interface SocketMetrics {
  totalConnections: number;
  adminConnections: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  checks: {
    database: HealthCheck;
    memory: MemoryCheck;
  };
  system: SystemInfo;
  sockets: SocketMetrics;
}

export interface GlobalStats {
  totalAdmins: number;
  totalRoles: number;
  totalSocieties: number;
  totalUsers: number;
  activeConnections: number;
  adminConnections: number;
  timestamp: string;
}

export interface ConfigItem {
  id: string;
  key: string;
  value: unknown;
  description?: string;
  isPublic: boolean;
}
