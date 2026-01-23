import { Request, Response } from 'express';
import { BaseController } from '../../../core/base.controller';
import { asyncHandler } from '../../../types';
import { globalStatsService } from '../../../services/global-stats.service';
import { systemConfigService } from '../../../services/system-config.service';
import { superAdminService, AdminNodeData, UpdateAdminData } from './service';
import { SystemConfig } from '../../../models';
import { BadRequestError } from '../../../middleware/errors';
import { collectHealthData } from '../../health/health.utils';

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

  getDashboardData = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const [stats, configs, health] = await Promise.all([
      globalStatsService.getStats(),
      SystemConfig.findAll({ order: [['key', 'ASC']] }),
      collectHealthData(),
    ]);

    return this.success(req, res, {
      stats,
      configs,
      health,
    });
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

  addAdmin = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id: societyId } = req.params;
    const admin = await superAdminService.addAdmin(societyId as string, req.body as AdminNodeData);
    return this.created(req, res, admin, 'Admin registered successfully');
  });

  updateAdmin = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id: adminId } = req.params;
    const admin = await superAdminService.updateAdmin(
      adminId as string,
      req.body as UpdateAdminData
    );
    return this.success(req, res, admin, 'Admin updated successfully');
  });

  deleteAdmin = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id: adminId } = req.params;
    const result = await superAdminService.deleteAdmin(adminId as string);
    return this.success(req, res, result, 'Admin deleted successfully');
  });
}

export const superAdminController = new SuperAdminController();
