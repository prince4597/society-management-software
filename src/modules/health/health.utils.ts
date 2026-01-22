import os from 'os';
import { sequelize } from '../../config/database';
import { logger } from '../../utils/logger';
import { socketManager } from '../../core/socket';

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

export interface HealthStatus {
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

const VERSION = process.env['npm_package_version'] ?? '1.0.0';

export async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await sequelize.authenticate();
    return {
      status: 'up',
      latency: Date.now() - start,
    };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return {
      status: 'down',
      message: 'Connection failed',
    };
  }
}

export function checkMemory(): MemoryCheck {
  const memoryUsage = process.memoryUsage();
  const percentage = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);

  return {
    status: percentage > 90 ? 'warning' : 'up',
    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    rss: Math.round(memoryUsage.rss / 1024 / 1024),
    percentage,
  };
}

export function getSystemInfo(): SystemInfo {
  const cpus = os.cpus();
  const firstCpu = cpus[0];
  return {
    platform: os.platform(),
    cpuModel: firstCpu ? firstCpu.model : 'Unknown',
    cpus: cpus.length,
    loadAvg: os.loadavg(),
  };
}

export function getSocketMetrics(): SocketMetrics {
  return {
    totalConnections: socketManager.getConnectionCount(),
    adminConnections: socketManager.getAdminRoomSize(),
  };
}

export function determineOverallStatus(
  database: HealthCheck,
  memory: MemoryCheck
): 'healthy' | 'degraded' | 'unhealthy' {
  if (database.status === 'down') return 'unhealthy';
  if (memory.status === 'warning') return 'degraded';
  return 'healthy';
}

export async function collectHealthData(): Promise<HealthStatus> {
  const database = await checkDatabase();
  const memory = checkMemory();
  const status = determineOverallStatus(database, memory);

  return {
    status,
    version: VERSION,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    checks: {
      database,
      memory,
    },
    system: getSystemInfo(),
    sockets: getSocketMetrics(),
  };
}
