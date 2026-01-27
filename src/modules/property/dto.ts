import {
  OccupancyStatus,
  MaintenanceRule,
  MaintenanceStatus,
  UnitType,
} from '../../models/property.model';

export interface CreatePropertyInput {
  number: string;
  floor: number;
  block: string;
  unitType: UnitType;
  occupancyStatus: OccupancyStatus;
  maintenanceRule: MaintenanceRule;
  maintenanceStatus: MaintenanceStatus;
  ownerId?: string;
  tenantId?: string;
  squareFeet?: number;
}

export interface UpdatePropertyInput {
  number?: string;
  floor?: number;
  block?: string;
  unitType?: UnitType;
  occupancyStatus?: OccupancyStatus;
  maintenanceRule?: MaintenanceRule;
  maintenanceStatus?: MaintenanceStatus;
  ownerId?: string;
  tenantId?: string;
  squareFeet?: number;
}
