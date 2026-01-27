import { adminRepository } from '../repository';
import { societyRepository } from '../../society/repository';
import { residentRepository } from '../../resident/repository';
import { propertyRepository } from '../../property/repository';
import { logger } from '../../../utils/logger';
import { socketManager } from '../../../core/socket';
import { VALID_ROLES } from '../../../constants/roles';
import type { GlobalStats } from '../../../types/shared';

export class DashboardService {
  async getStats(): Promise<GlobalStats> {
    try {
      const [adminCount, societyCount] = await Promise.all([
        adminRepository.count(),
        societyRepository.count(),
      ]);

      const totalFlats = await societyRepository.getModel().sum('totalFlats');

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
      logger.error('Error fetching dashboard global stats:', error);
      throw error;
    }
  }

  async getSocietyStats(societyId: string): Promise<{
    totalResidents: number;
    totalProperties: number;
    totalFlats: number;
  }> {
    try {
      const [residentCount, propertyCount] = await Promise.all([
        residentRepository.count({ societyId } as Record<string, unknown>),
        propertyRepository.count({ societyId } as Record<string, unknown>),
      ]);

      const societyResponse = await societyRepository.findById(societyId);

      return {
        totalResidents: residentCount,
        totalProperties: propertyCount,
        totalFlats: societyResponse?.totalFlats || 0,
      };
    } catch (error) {
      logger.error(`Error fetching dashboard stats for society ${societyId}:`, error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
