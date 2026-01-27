import { Request, Response } from 'express';
import { BaseController } from '../../core/base.controller';
import { asyncHandler } from '../../types';
import { residentService } from './service';
import type { CreateResidentInput, UpdateResidentInput } from './dto';

class ResidentController extends BaseController {
  create = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const input = req.body as CreateResidentInput;
    const resident = await residentService.create(societyId, input);
    return this.created(req, res, resident, 'Resident created successfully');
  });

  findAll = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const residents = await residentService.findAll(societyId);
    return this.success(req, res, residents);
  });

  findById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const id = req.params['id'] as string;
    const resident = await residentService.findById(societyId, id);
    return this.success(req, res, resident);
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const id = req.params['id'] as string;
    const data = req.body as UpdateResidentInput;
    const resident = await residentService.update(societyId, id, data);
    return this.success(req, res, resident, 'Resident updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const id = req.params['id'] as string;
    await residentService.delete(societyId, id);
    return this.success(req, res, null, 'Resident deleted successfully');
  });
}

export const residentController = new ResidentController();
