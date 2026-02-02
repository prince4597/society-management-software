import { z } from 'zod';
import {
  OccupancyStatus,
  MaintenanceRule,
  MaintenanceStatus,
  UnitType,
} from '../../models/property.model';

export const createPropertySchema = z.object({
  body: z.object({
    number: z.string().min(1, 'Property number is required').trim(),
    floor: z.number().int().min(-5).max(200),
    block: z.string().min(1, 'Block is required').trim(),
    unitType: z.nativeEnum(UnitType),
    occupancyStatus: z.nativeEnum(OccupancyStatus).optional(),
    maintenanceRule: z.nativeEnum(MaintenanceRule).optional(),
    maintenanceStatus: z.nativeEnum(MaintenanceStatus).optional(),
    ownerId: z.string().uuid().optional(),
    tenantId: z.string().uuid().optional(),
    squareFeet: z.number().positive().optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    number: z.string().min(1).trim().optional(),
    floor: z.number().int().min(-5).max(200).optional(),
    block: z.string().min(1).trim().optional(),
    unitType: z.nativeEnum(UnitType).optional(),
    occupancyStatus: z.nativeEnum(OccupancyStatus).optional(),
    maintenanceRule: z.nativeEnum(MaintenanceRule).optional(),
    maintenanceStatus: z.nativeEnum(MaintenanceStatus).optional(),
    ownerId: z.string().uuid().optional(),
    tenantId: z.string().uuid().optional(),
    squareFeet: z.number().positive().optional(),
  }),
});

export const propertyIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid property ID'),
  }),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>['body'];
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>['body'];
