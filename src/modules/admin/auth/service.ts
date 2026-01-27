import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { adminRepository } from '../repository';
import { societyRepository } from '../../society/repository';
import { UnauthorizedError, BadRequestError, ConflictError } from '../../../middleware/errors';
import { signToken } from '../../../utils/jwt';
import { LoginInput } from './dto';
import type { AdminAttributes } from '../../../models/admin.model';
import type { SocietyAttributes } from '../../../models/society.model';

export interface AdminProfile extends Omit<AdminAttributes, 'password'> {
  society?: {
    id: string;
    name: string;
  };
}

export interface LoginResponse {
  token: string;
  admin: AdminProfile;
}

interface AdminWithSociety extends AdminAttributes {
  society?: SocietyAttributes;
}

export class AuthService {
  public async login(input: LoginInput): Promise<LoginResponse> {
    const admin = await adminRepository.findOne({
      where: { email: input.email, isActive: true } as Record<string, unknown>,
      include: [
        {
          model: societyRepository.getModel(),
          as: 'society',
          attributes: ['id', 'name'],
        },
      ],
    }) as AdminWithSociety | null;

    if (!admin) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const password = admin.password;
    if (!password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await adminRepository.update(admin.id, { lastLogin: new Date() });

    const token = signToken({
      id: admin.id,
      role: admin.role,
      societyId: admin.societyId,
    });

    return {
      token,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        role: admin.role,
        isActive: admin.isActive,
        society: admin.society
          ? {
            id: admin.society.id,
            name: admin.society.name,
          }
          : undefined,
        lastLogin: admin.lastLogin || undefined,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    };
  }

  public async getProfile(adminId: string): Promise<AdminProfile> {
    const admin = await adminRepository.findOne({
      where: { id: adminId } as Record<string, unknown>,
      include: [{ model: societyRepository.getModel(), as: 'society', attributes: ['id', 'name'] }],
    }) as AdminWithSociety | null;

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError('Account not found or inactive');
    }

    return {
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      role: admin.role,
      isActive: admin.isActive,
      society: admin.society
        ? {
          id: admin.society.id,
          name: admin.society.name,
        }
        : undefined,
      lastLogin: admin.lastLogin || undefined,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }

  public async updateProfile(adminId: string, input: Partial<AdminProfile>): Promise<AdminProfile> {
    const admin = await adminRepository.findById(adminId);

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError('Account not found or inactive');
    }

    const updateData: Partial<AdminAttributes> = {};

    if (input.firstName) {
      const trimmedName = input.firstName.trim();
      if (trimmedName && trimmedName !== admin.firstName) {
        updateData.firstName = trimmedName;
      }
    }

    if (input.lastName) {
      const trimmedName = input.lastName.trim();
      if (trimmedName && trimmedName !== admin.lastName) {
        updateData.lastName = trimmedName;
      }
    }

    if (input.phoneNumber) {
      const trimmedPhone = input.phoneNumber.trim();
      if (trimmedPhone && trimmedPhone !== admin.phoneNumber) {
        const phoneRegex = /^\+\d{2}\s\d{10}$/;
        if (!phoneRegex.test(trimmedPhone)) {
          throw new BadRequestError(
            'Invalid phone format. Protocol: +CC XXXXXXXXXX (e.g. +91 9876543210)'
          );
        }

        const existing = await adminRepository.findOne({
          where: {
            phoneNumber: trimmedPhone,
            id: { [Op.ne]: adminId },
          } as Record<string, unknown>,
          paranoid: false,
        });

        if (existing) {
          throw new ConflictError('Phone number already in use by another account');
        }

        updateData.phoneNumber = trimmedPhone;
      }
    }

    await adminRepository.update(adminId, updateData);

    return this.getProfile(adminId);
  }
}
