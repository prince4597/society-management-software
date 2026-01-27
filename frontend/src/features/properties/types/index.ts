import { ResidentRole } from '../../residents/types';
export { ResidentRole };

export enum OccupancyStatus {
    OWNER_OCCUPIED = 'OWNER_OCCUPIED',
    RENTED = 'RENTED',
    VACANT = 'VACANT',
}

export enum MaintenanceRule {
    DEFAULT_OWNER = 'DEFAULT_OWNER',
    CUSTOM_TENANT = 'CUSTOM_TENANT',
}

export enum MaintenanceStatus {
    PAID = 'PAID',
    DUE = 'DUE',
    OVERDUE = 'OVERDUE',
}

export enum UnitType {
    BHK_1 = '1 BHK',
    BHK_2 = '2 BHK',
    BHK_3 = '3 BHK',
    PENTHOUSE = 'Penthouse',
}

/**
 * Resident reference for property associations
 * Minimal type to avoid circular dependencies with residents feature
 */
export interface ResidentReference {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: ResidentRole;
    flatIds: string[];
    isResident: boolean;
}

export interface Flat {
    id: string;
    number: string;
    floor: number;
    block: string;
    unitType: UnitType;
    occupancyStatus: OccupancyStatus;
    maintenanceRule: MaintenanceRule;
    maintenanceStatus: MaintenanceStatus;
    ownerId: string;
    tenantId?: string;
    squareFeet?: number;
    residents?: ResidentReference[];
}

export type CreateFlatInput = Omit<Flat, 'id' | 'residents'>;
export type UpdateFlatInput = Partial<CreateFlatInput>;

