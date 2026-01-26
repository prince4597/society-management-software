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
}
