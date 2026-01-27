export enum ResidentRole {
    PRIMARY_OWNER = 'PRIMARY_OWNER',
    TENANT = 'TENANT',
    FAMILY_MEMBER = 'FAMILY_MEMBER',
}

export enum RelationType {
    WIFE = 'Wife',
    SON = 'Son',
    DAUGHTER = 'Daughter',
    PARENT = 'Parent',
    SIBLING = 'Sibling',
    OTHER = 'Other',
}

export interface FamilyMember {
    id: string;
    name: string;
    relation: RelationType;
    phoneNumber?: string;
    email?: string;
}

export interface Resident {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: ResidentRole;
    flatIds: string[]; // A resident can be linked to multiple flats (especially owners)
    isResident: boolean; // True if living in the society, false if non-resident owner
    familyMembers?: FamilyMember[];
    profileImage?: string;
    ownedProperties?: any[];
    rentedProperties?: any[];
}
