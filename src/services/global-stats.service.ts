import { Admin, Role } from '../models';
import { logger } from '../utils/logger';
import { socketManager } from '../core/socket';

export interface GlobalStats {
  totalAdmins: number;
  totalRoles: number;
  totalSocieties: number; // Placeholder for now
  totalUsers: number; // Placeholder for now
  activeConnections: number;
  adminConnections: number;
  timestamp: string;
}

class GlobalStatsService {
  private static instance: GlobalStatsService;

  private constructor() {}

  static getInstance(): GlobalStatsService {
    if (!GlobalStatsService.instance) {
      GlobalStatsService.instance = new GlobalStatsService();
    }
    return GlobalStatsService.instance;
  }

  async getStats(): Promise<GlobalStats> {
    try {
      const [adminCount, roleCount] = await Promise.all([Admin.count(), Role.count()]);

      return {
        totalAdmins: adminCount,
        totalRoles: roleCount,
        totalSocieties: 42, // Mock for now until Society model added
        totalUsers: 8400, // Mock for now
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

export const globalStatsService = GlobalStatsService.getInstance();
