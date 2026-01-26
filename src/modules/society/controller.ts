import { Request, Response } from 'express';
import { BaseController } from '../../core/base.controller';
import { asyncHandler } from '../../types';
import { societyService, OnboardResult } from './service';
import type { CreateSocietyInput, UpdateSocietyInput } from './dto';

class SocietyController extends BaseController {
  onboard = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const input = req.body as CreateSocietyInput;
    const result: OnboardResult = await societyService.onboardSociety(input);
    return this.created(req, res, result, 'Society onboarded successfully');
  });

  findAll = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societies = await societyService.findAll();
    return this.success(req, res, societies);
  });

  findById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const id = req.params['id'] as string;
    const society = await societyService.findById(id);
    return this.success(req, res, society);
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const id = req.params['id'] as string;
    const data = req.body as UpdateSocietyInput;
    const society = await societyService.update(id, data);
    return this.success(req, res, society, 'Society updated successfully');
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
    const society = await societyService.findById(societyId);
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
    const society = await societyService.update(societyId, data);
    return this.success(req, res, society, 'Society profile updated successfully');
  });
}

export const societyController = new SocietyController();
