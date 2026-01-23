import { Admin, Role, Society } from '../models';
import { logger } from '../utils/logger';
import { socketManager } from '../core/socket';
import { createSingleton } from '../core/singleton';
import type { GlobalStats } from '../types/shared';

class GlobalStatsService {
  async getStats(): Promise<GlobalStats> {
    try {
      const [adminCount, roleCount, societyCount, totalFlats] = await Promise.all([
        Admin.count(),
        Role.count(),
        Society.count(),
        Society.sum('totalFlats'),
      ]);

      return {
        totalAdmins: adminCount,
        totalRoles: roleCount,
        totalSocieties: societyCount,
        totalUsers: totalFlats || 0,
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
