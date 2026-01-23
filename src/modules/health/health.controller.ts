import { Request, Response } from 'express';
import { BaseController } from '../../core/base.controller';
import { createSuccessResponse, getRequestId } from '../../core/response.helpers';
import { asyncHandler } from '../../types';
import type { SystemHealth } from '../../types/shared';
import { checkDatabase, collectHealthData } from './health.utils';

class HealthController extends BaseController {
  getHealth = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const health = await collectHealthData();
    const httpStatus = health.status === 'unhealthy' ? 503 : 200;
    const requestId = getRequestId(req);

    return res.status(httpStatus).json(createSuccessResponse(requestId, health, undefined));
  });

  getLiveness = asyncHandler((req: Request, res: Response): Promise<Response> => {
    return Promise.resolve(this.success(req, res, { status: 'alive' }));
  });

  getReadiness = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const database = await checkDatabase();
    const requestId = getRequestId(req);

    if (database.status === 'down') {
      return res
        .status(503)
        .json(
          createSuccessResponse(requestId, { status: 'not_ready', reason: 'Database unavailable' })
        );
    }

    return this.success(req, res, { status: 'ready' });
  });
}

export const healthController = new HealthController();

export type { SystemHealth as HealthStatus };
