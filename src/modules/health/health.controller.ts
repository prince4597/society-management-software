import { Request, Response } from 'express';
import { BaseController } from '../../core/base.controller';
import { asyncHandler, ApiResponse } from '../../types';
import { HealthStatus, checkDatabase, collectHealthData } from './health.utils';

class HealthController extends BaseController {
  getHealth = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const health = await collectHealthData();
    const httpStatus = health.status === 'unhealthy' ? 503 : 200;

    return res.status(httpStatus).json({
      success: health.status !== 'unhealthy',
      data: health,
      requestId: req.context?.requestId ?? 'unknown',
      timestamp: new Date().toISOString(),
    });
  });

  getLiveness = asyncHandler((req: Request, res: Response): Promise<Response> => {
    return Promise.resolve(this.success(req, res, { status: 'alive' }));
  });

  getReadiness = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const database = await checkDatabase();

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

export type { HealthStatus };
