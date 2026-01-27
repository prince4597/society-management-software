import { ResidentRole, FamilyMember } from '../../models/resident.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateResidentInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         phoneNumber:
 *           type: string
 *           example: "+919876543210"
 *         role:
 *           type: string
 *           enum: [PRIMARY_OWNER, JOINT_OWNER, TENANT, FAMILY_MEMBER]
 *         isResident:
 *           type: boolean
 *           default: true
 *         flatIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         profileImage:
 *           type: string
 *           format: uri
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateResidentInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phoneNumber:
 *           type: string
 *         role:
 *           type: string
 *           enum: [PRIMARY_OWNER, JOINT_OWNER, TENANT, FAMILY_MEMBER]
 *         isResident:
 *           type: boolean
 *         flatIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         profileImage:
 *           type: string
 *           format: uri
 */
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
