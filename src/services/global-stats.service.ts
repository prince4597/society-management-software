import { Admin, Society } from '../models';
import { logger } from '../utils/logger';
import { socketManager } from '../core/socket';
import { createSingleton } from '../core/singleton';
import { VALID_ROLES } from '../constants/roles';
import type { GlobalStats } from '../types/shared';

class GlobalStatsService {
  async getStats(): Promise<GlobalStats> {
    try {
      const [adminCount, societyCount, totalFlats] = await Promise.all([
        Admin.count(),
        Society.count(),
        Society.sum('totalFlats'),
      ]);

      const roleCount = VALID_ROLES.length;

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
