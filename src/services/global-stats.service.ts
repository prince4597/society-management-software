import { Admin, Role } from '../models';
import { logger } from '../utils/logger';
import { socketManager } from '../core/socket';
import { createSingleton } from '../core/singleton';
import type { GlobalStats } from '../types/shared';

class GlobalStatsService {
  async getStats(): Promise<GlobalStats> {
    try {
      const [adminCount, roleCount] = await Promise.all([Admin.count(), Role.count()]);

      return {
        totalAdmins: adminCount,
        totalRoles: roleCount,
        totalSocieties: 42,
        totalUsers: 8400,
        activeConnections: socketManager.getConnectionCount(),
        adminConnections: socketManager.getAdminRoomSize(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Error fetching global stats:', error);
      throw error;
    }
  }
}

export const globalStatsService = createSingleton(() => new GlobalStatsService())();
export type { GlobalStats };
