import { Request, Response } from 'express';
import { sequelize } from '../../config/database';
import { BaseController } from '../../core/base.controller';
import { asyncHandler, ApiResponse } from '../../types';
import { logger } from '../../utils/logger';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  checks: {
    database: HealthCheck;
    memory: MemoryCheck;
  };
}

interface HealthCheck {
  status: 'up' | 'down';
  latency?: number;
  message?: string;
}

interface MemoryCheck {
  status: 'up' | 'warning';
  heapUsed: number;
  heapTotal: number;
  rss: number;
  percentage: number;
}

class HealthController extends BaseController {
  private readonly version = process.env['npm_package_version'] ?? '1.0.0';

  private async checkDatabase(): Promise<HealthCheck> {
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

  private checkMemory(): MemoryCheck {
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

  private determineOverallStatus(
    database: HealthCheck,
    memory: MemoryCheck
  ): 'healthy' | 'degraded' | 'unhealthy' {
    if (database.status === 'down') return 'unhealthy';
    if (memory.status === 'warning') return 'degraded';
    return 'healthy';
  }

  getHealth = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const database = await this.checkDatabase();
    const memory = this.checkMemory();
    const status = this.determineOverallStatus(database, memory);

    const health: HealthStatus = {
      status,
      version: this.version,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      checks: {
        database,
        memory,
      },
    };

    const httpStatus = status === 'unhealthy' ? 503 : 200;
    return res.status(httpStatus).json({
      success: status !== 'unhealthy',
      data: health,
      requestId: req.context?.requestId ?? 'unknown',
      timestamp: new Date().toISOString(),
    });
  });

  getLiveness = asyncHandler((req: Request, res: Response): Promise<Response> => {
    return Promise.resolve(this.success(req, res, { status: 'alive' }));
  });

  getReadiness = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const database = await this.checkDatabase();

    if (database.status === 'down') {
      return res.status(503).json({
        success: false,
        data: { status: 'not_ready', reason: 'Database unavailable' },
        requestId: req.context?.requestId ?? 'unknown',
        timestamp: new Date().toISOString(),
      } as ApiResponse<{ status: string; reason: string }>);
    }

    return this.success(req, res, { status: 'ready' });
  });
}

export const healthController = new HealthController();
