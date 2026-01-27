import { Request, Response } from 'express';
import { BaseController } from '../../core/base.controller';
import { asyncHandler } from '../../types';
import { societyService, OnboardResult } from './service';
import { dashboardService } from '../admin/dashboard/service';
import type { CreateSocietyInput, UpdateSocietyInput } from './dto';

class SocietyController extends BaseController {
  onboard = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const input = req.body as CreateSocietyInput;
    const result: OnboardResult = await societyService.onboardSociety(input);
    return this.created(req, res, result, 'Society onboarded successfully');
  });

  findAll = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const response = await societyService.findAll();
    return this.success(req, res, response.data);
  });

  findById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const id = req.params['id'] as string;
    const society = await societyService.getSocietyDetails(id);
    return this.success(req, res, society);
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const id = req.params['id'] as string;
    const data = req.body as UpdateSocietyInput;
    const response = await societyService.update(id, data);
    return this.success(req, res, response.data, 'Society updated successfully');
  });

  getAdmins = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const id = req.params['id'] as string;
    const admins = await societyService.getAdmins(id);
    return this.success(req, res, admins);
  });

  findMySociety = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user?.societyId;
    if (!societyId) {
      return res
        .status(403)
        .json({ success: false, message: 'No society associated with this account' });
    }
    const society = await societyService.getSocietyDetails(societyId);
    return this.success(req, res, society);
  });

  updateMySociety = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user?.societyId;
    if (!societyId) {
      return res
        .status(403)
        .json({ success: false, message: 'No society associated with this account' });
    }
    const data = req.body as UpdateSocietyInput;
    const response = await societyService.update(societyId, data);
    return this.success(req, res, response.data, 'Society profile updated successfully');
  });

  getStats = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user?.societyId;
    if (!societyId) {
      return res
        .status(403)
        .json({ success: false, message: 'No society associated with this account' });
    }
    const stats = await dashboardService.getSocietyStats(societyId);
    return this.success(req, res, stats);
  });
}

export const societyController = new SocietyController();
