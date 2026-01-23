import { Request, Response } from 'express';
import { BaseController } from '../../../core/base.controller';
import { asyncHandler } from '../../../types';
import { globalStatsService } from '../../../services/global-stats.service';
import { systemConfigService } from '../../../services/system-config.service';
import { SystemConfig } from '../../../models';
import { BadRequestError } from '../../../middleware/errors';

interface UpdateConfigInput {
  key: string;
  value: unknown;
  description?: string;
}

class SuperAdminController extends BaseController {
  getStats = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const stats = await globalStatsService.getStats();
    return this.success(req, res, stats);
  });

  getConfigs = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const configs = await SystemConfig.findAll({ order: [['key', 'ASC']] });
    return this.success(req, res, configs);
  });

  updateConfig = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { key, value, description } = req.body as UpdateConfigInput;

    if (!key) {
      throw new BadRequestError('Key is required');
    }

    await systemConfigService.set(key, value, description);
    return this.success(req, res, { message: 'Config updated successfully' });
  });
}

export const superAdminController = new SuperAdminController();
