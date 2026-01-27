import { Request, Response } from 'express';
import { BaseController } from '../../core/base.controller';
import { asyncHandler } from '../../types';
import { propertyService } from './service';
import type { CreatePropertyInput, UpdatePropertyInput } from './dto';

class PropertyController extends BaseController {
  create = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const input = req.body as CreatePropertyInput;
    const property = await propertyService.createInSociety(societyId, input);
    return this.created(req, res, property, 'Property created successfully');
  });

  findAll = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const { page, limit, sortBy, sortOrder } = req.query;

    const properties = await propertyService.findAllPaginatedInSociety(societyId, {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
    });

    return this.success(req, res, properties);
  });

  findById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const id = req.params['id'] as string;
    const property = await propertyService.findByIdInSociety(societyId, id);
    return this.success(req, res, property);
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const id = req.params['id'] as string;
    const data = req.body as UpdatePropertyInput;
    const property = await propertyService.updateInSociety(societyId, id, data);
    return this.success(req, res, property, 'Property updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const societyId = req.user!.societyId!;
    const id = req.params['id'] as string;
    await propertyService.deleteFromSociety(societyId, id);
    return this.success(req, res, null, 'Property deleted successfully');
  });
}

export const propertyController = new PropertyController();
