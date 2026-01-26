import { Flat, OccupancyStatus, MaintenanceRule, MaintenanceStatus, UnitType } from '../types';
import { Resident, ResidentRole, RelationType } from '../../residents/types';

export const MOCK_RESIDENTS: Resident[] = [
    {
        id: 'res-1',
        firstName: 'Amit',
        lastName: 'Sharma',
        email: 'amit.sharma@example.com',
        phoneNumber: '+91 9876543210',
        role: ResidentRole.PRIMARY_OWNER,
        flatIds: ['a-101', 'a-402'], // Owns two flats in Block A
        isResident: true,
        familyMembers: [
            { id: 'fam-1', name: 'Sunita Sharma', relation: RelationType.WIFE, phoneNumber: '+91 9876543211' },
            { id: 'fam-2', name: 'Rohan Sharma', relation: RelationType.SON },
        ],
    },
    {
        id: 'res-2',
        firstName: 'Priya',
        lastName: 'Verma',
        email: 'priya.v@example.com',
        phoneNumber: '+91 9822334455',
        role: ResidentRole.TENANT,
        flatIds: ['a-202'],
        isResident: true,
        familyMembers: [
            { id: 'fam-3', name: 'Anil Verma', relation: RelationType.PARENT },
        ],
    },
    {
        id: 'res-3',
        firstName: 'Vikram',
        lastName: 'Singh',
        email: 'vikram.s@example.com',
        phoneNumber: '+91 9811223344',
        role: ResidentRole.PRIMARY_OWNER,
        flatIds: ['a-202'], // Owner of rented flat
        isResident: false,
    },
    {
        id: 'res-4',
        firstName: 'Suresh',
        lastName: 'Iyer',
        email: 'suresh.iyer@example.com',
        phoneNumber: '+91 9988776655',
        role: ResidentRole.PRIMARY_OWNER,
        flatIds: ['a-102', 'b-301'], // Owns flats across blocks
        isResident: true,
    },
    {
        id: 'res-5',
        firstName: 'Rajesh',
        lastName: 'Kulkarni',
        email: 'rajesh.k@example.com',
        phoneNumber: '+91 9123456789',
        role: ResidentRole.TENANT,
        flatIds: ['b-101'],
        isResident: true,
    }
];

// Generating a robust set of flats based on user requirements
const generateFlats = (): Flat[] => {
    const flats: Flat[] = [];

    // Example 1: Block A (5 Floors, 5 Units per floor 101-505)
    for (let floor = 1; floor <= 5; floor++) {
        for (let unit = 1; unit <= 5; unit++) {
            const unitNumber = `${floor}0${unit}`;
            const id = `a-${unitNumber}`;

            // As per user: 103, 203... are 1BHK, others are 2BHK
            const is1BHK = unit === 3;

            flats.push({
                id,
                number: unitNumber,
                floor,
                block: 'A',
                unitType: is1BHK ? UnitType.BHK_1 : UnitType.BHK_2,
                occupancyStatus: floor === 2 && unit === 2 ? OccupancyStatus.RENTED : (unit < 3 ? OccupancyStatus.OWNER_OCCUPIED : OccupancyStatus.VACANT),
                maintenanceRule: MaintenanceRule.DEFAULT_OWNER,
                maintenanceStatus: unit % 3 === 0 ? MaintenanceStatus.DUE : MaintenanceStatus.PAID,
                ownerId: unit === 1 ? 'res-1' : (unit === 2 ? (floor === 2 ? 'res-3' : 'res-4') : ''),
                tenantId: floor === 2 && unit === 2 ? 'res-2' : undefined,
                squareFeet: is1BHK ? 850 : 1200,
            });
        }
    }

    // Example 2: Blocks B-F (7 Floors, 4 Units per floor 101-704)
    ['B', 'C', 'D', 'E', 'F'].forEach(block => {
        for (let floor = 1; floor <= 7; floor++) {
            for (let unit = 1; unit <= 4; unit++) {
                const unitNumber = `${floor}0${unit}`;
                const id = `${block.toLowerCase()}-${unitNumber}`;

                flats.push({
                    id,
                    number: unitNumber,
                    floor,
                    block,
                    unitType: unit === 3 || unit === 4 ? UnitType.BHK_3 : UnitType.BHK_2,
                    occupancyStatus: floor === 1 && unit === 1 && block === 'B' ? OccupancyStatus.RENTED : OccupancyStatus.VACANT,
                    maintenanceRule: MaintenanceRule.DEFAULT_OWNER,
                    maintenanceStatus: MaintenanceStatus.PAID,
                    ownerId: block === 'B' && unit === 1 ? 'res-4' : '',
                    tenantId: block === 'B' && unit === 1 && floor === 1 ? 'res-5' : undefined,
                });
            }
        }
    });

    return flats;
};

export const MOCK_FLATS: Flat[] = generateFlats();
