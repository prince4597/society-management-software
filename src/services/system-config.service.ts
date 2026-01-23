import { SystemConfig } from '../models';
import { logger } from '../utils/logger';
import { broadcastToAdmins } from '../core/socket';
import { createSingleton } from '../core/singleton';

class SystemConfigService {
  async get(key: string, defaultValue: unknown = null): Promise<unknown> {
    try {
      const config = await SystemConfig.findOne({ where: { key } });
      return config ? config.value : defaultValue;
    } catch (error) {
      logger.error(`Error getting config ${key}:`, error);
      return defaultValue;
    }
  }

  async set(key: string, value: unknown, description?: string): Promise<void> {
    try {
      await SystemConfig.upsert({
        key,
        value,
        description,
      });

      logger.info(`System config updated: ${key} =`, value);

      broadcastToAdmins('system:notification', {
        type: 'info',
        message: `System configuration updated: ${key}`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error setting config ${key}:`, error);
      throw error;
    }
  }

  async isMaintenanceMode(): Promise<boolean> {
    return (await this.get('maintenance_mode', false)) === true;
  }

  async isRegistrationEnabled(): Promise<boolean> {
    return (await this.get('registration_enabled', true)) === true;
  }
}

export const systemConfigService = createSingleton(() => new SystemConfigService())();
