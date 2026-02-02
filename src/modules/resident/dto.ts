import { z } from 'zod';
import { ResidentRole } from '../../models/resident.model';

const familyMemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  relation: z.string().min(1, 'Relation is required'),
  phoneNumber: z
    .string()
    .regex(/^\+\d{2}\s\d{10}$/, 'Invalid phone format. Protocol: +CC XXXXXXXXXX')
    .optional(),
  email: z.string().email().optional(),
});

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
 *           example: "+91 9876543210"
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
 *         familyMembers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               relationship:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 */
export const createResidentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').trim(),
    lastName: z.string().min(1, 'Last name is required').trim(),
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    phoneNumber: z
      .string()
      .regex(/^\+\d{2}\s\d{10}$/, 'Invalid phone format. Protocol: +CC XXXXXXXXXX'),
    role: z.nativeEnum(ResidentRole),
    isResident: z.boolean().default(true),
    familyMembers: z.array(familyMemberSchema).optional(),
    flatIds: z.array(z.string().uuid()).optional(),
    profileImage: z.string().url().optional(),
  }),
});

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
export const updateResidentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).trim().optional(),
    lastName: z.string().min(1).trim().optional(),
    email: z.string().email().trim().toLowerCase().optional(),
    phoneNumber: z
      .string()
      .regex(/^\+\d{2}\s\d{10}$/, 'Invalid phone format. Protocol: +CC XXXXXXXXXX')
      .optional(),
    role: z.nativeEnum(ResidentRole).optional(),
    isResident: z.boolean().optional(),
    familyMembers: z.array(familyMemberSchema).optional(),
    flatIds: z.array(z.string().uuid()).optional(),
    profileImage: z.string().url().optional(),
  }),
});

export const residentIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid resident ID'),
  }),
});

export type CreateResidentInput = z.infer<typeof createResidentSchema>['body'];
export type UpdateResidentInput = z.infer<typeof updateResidentSchema>['body'];
