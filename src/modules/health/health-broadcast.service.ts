import { logger } from '../../utils/logger';
import { socketManager } from '../../core/socket';
import { collectHealthData } from './health.utils';
import { globalStatsService } from '../../services/global-stats.service';

class HealthBroadcastService {
  private static instance: HealthBroadcastService;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly broadcastIntervalMs = 5000;
  private isRunning = false;

  private constructor() {}

  static getInstance(): HealthBroadcastService {
    if (!HealthBroadcastService.instance) {
      HealthBroadcastService.instance = new HealthBroadcastService();
    }
    return HealthBroadcastService.instance;
  }

  start(): void {
    if (this.isRunning) {
      logger.warn('HealthBroadcastService already running');
      return;
    }

    this.isRunning = true;
    logger.info('HealthBroadcastService started', { intervalMs: this.broadcastIntervalMs });

    this.intervalId = setInterval(() => {
      void this.broadcastIfNeeded();
    }, this.broadcastIntervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    logger.info('HealthBroadcastService stopped');
  }

  async broadcastImmediate(): Promise<void> {
    try {
      const [health, stats] = await Promise.all([
        collectHealthData(),
        globalStatsService.getStats(),
      ]);
      socketManager.broadcastToAdmins('health:update', health);
      socketManager.broadcastToAdmins('system:stats:update', stats);
      logger.debug('Immediate health and stats broadcast sent');
    } catch (error) {
      logger.error('Immediate broadcast failed', { error });
    }
  }

  private async broadcastIfNeeded(): Promise<void> {
    const adminCount = socketManager.getAdminRoomSize();

    if (adminCount === 0) {
      return;
    }

    try {
      const [health, stats] = await Promise.all([
        collectHealthData(),
        globalStatsService.getStats(),
      ]);
      socketManager.broadcastToAdmins('health:update', health);
      socketManager.broadcastToAdmins('system:stats:update', stats);
    } catch (error) {
      logger.error('Health/Stats broadcast failed', { error });
    }
  }
}

export const healthBroadcastService = HealthBroadcastService.getInstance();
