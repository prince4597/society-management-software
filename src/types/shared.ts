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

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type EntityId = number;
