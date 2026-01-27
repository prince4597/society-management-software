import { ResidentRole, FamilyMember } from '../../models/resident.model';

export interface CreateResidentInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: ResidentRole;
  isResident: boolean;
  familyMembers?: FamilyMember[];
  flatIds?: string[];
  profileImage?: string;
}

export interface UpdateResidentInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: ResidentRole;
  isResident?: boolean;
  familyMembers?: FamilyMember[];
  flatIds?: string[];
  profileImage?: string;
}
