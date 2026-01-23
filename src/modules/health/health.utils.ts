import os from 'os';
import { sequelize } from '../../config/database';
import { logger } from '../../utils/logger';
import { socketManager } from '../../core/socket';
import type {
  HealthCheck,
  MemoryCheck,
  SystemInfo,
  SocketMetrics,
  SystemHealth,
} from '../../types/shared';

export type { HealthCheck, MemoryCheck, SystemInfo, SocketMetrics, SystemHealth };

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
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const percentage = Math.round((usedMem / totalMem) * 100);

  const v8Memory = process.memoryUsage();

  return {
    status: percentage > 90 ? 'warning' : 'up',
    heapUsed: Math.round(usedMem / 1024 / 1024),
    heapTotal: Math.round(totalMem / 1024 / 1024),
    rss: Math.round(v8Memory.rss / 1024 / 1024),
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

export async function collectHealthData(): Promise<SystemHealth> {
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
