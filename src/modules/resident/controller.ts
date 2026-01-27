import { Request, Response } from 'express';
import { BaseController } from '../../core/base.controller';
import { asyncHandler } from '../../types';
import { residentService } from './service';
import type { CreateResidentInput, UpdateResidentInput } from './dto';

class ResidentController extends BaseController {
  create = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const input = req.body as CreateResidentInput;
    const resident = await residentService.createWithSociety(societyId, input);
    return this.created(req, res, resident, 'Resident created successfully');
  });

  findAll = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const { page, limit, sortBy, sortOrder } = req.query;

    const residents = await residentService.findAllPaginatedInSociety(societyId, {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
    });

    return this.success(req, res, residents);
  });

  findById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const id = req.params['id'] as string;
    const resident = await residentService.findByIdInSociety(societyId, id);
    return this.success(req, res, resident);
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const id = req.params['id'] as string;
    const data = req.body as UpdateResidentInput;
    const serviceResponse = await residentService.update(id, data, societyId);
    return this.success(req, res, serviceResponse.data, 'Resident updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const id = req.params['id'] as string;
    await residentService.deleteFromSociety(societyId, id);
    return this.success(req, res, null, 'Resident deleted successfully');
  });
}

export const residentController = new ResidentController();
