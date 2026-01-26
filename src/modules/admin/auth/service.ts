import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import Admin from '../../../models/admin.model';
import Society from '../../../models/society.model';
import { UnauthorizedError, BadRequestError, ConflictError } from '../../../middleware/errors';
import { signToken } from '../../../utils/jwt';
import { LoginInput } from './dto';

export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
  society?: {
    id: string;
    name: string;
  };
  lastLogin: Date | null;
}

export interface LoginResponse {
  token: string;
  admin: AdminProfile;
}

export class AuthService {
  public async login(input: LoginInput): Promise<LoginResponse> {
    const admin = await Admin.findOne({
      where: { email: input.email, isActive: true },
      include: [
        {
          model: Society,
          as: 'society',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!admin) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    admin.lastLogin = new Date();
    await admin.save();

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
        society: admin.society
          ? {
              id: admin.society.id,
              name: admin.society.name,
            }
          : undefined,
        lastLogin: admin.lastLogin || null,
      },
    };
  }

  public async getProfile(adminId: string): Promise<AdminProfile> {
    const admin = await Admin.findByPk(adminId, {
      include: [{ model: Society, as: 'society', attributes: ['id', 'name'] }],
    });

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
      society: admin.society
        ? {
            id: admin.society.id,
            name: admin.society.name,
          }
        : undefined,
      lastLogin: admin.lastLogin || null,
    };
  }

  public async updateProfile(adminId: string, input: Partial<AdminProfile>): Promise<AdminProfile> {
    const admin = await Admin.findByPk(adminId, {
      include: [{ model: Society, as: 'society', attributes: ['id', 'name'] }],
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError('Account not found or inactive');
    }

    if (input.firstName) {
      const trimmedName = input.firstName.trim();
      if (trimmedName && trimmedName !== admin.firstName) {
        admin.firstName = trimmedName;
      }
    }

    if (input.lastName) {
      const trimmedName = input.lastName.trim();
      if (trimmedName && trimmedName !== admin.lastName) {
        admin.lastName = trimmedName;
      }
    }

    if (input.phoneNumber) {
      const trimmedPhone = input.phoneNumber.trim();
      if (trimmedPhone && trimmedPhone !== admin.phoneNumber) {
        // Strictly enforced: +CC [10 Digits]
        const phoneRegex = /^\+\d{2}\s\d{10}$/;
        if (!phoneRegex.test(trimmedPhone)) {
          throw new BadRequestError(
            'Invalid phone format. Protocol: +CC XXXXXXXXXX (e.g. +91 9876543210)'
          );
        }

        // Explicit uniqueness check
        const existing = await Admin.findOne({
          where: {
            phoneNumber: trimmedPhone,
            id: { [Op.ne]: adminId },
          },
          paranoid: false,
        });

        if (existing) {
          throw new ConflictError('Phone number already in use by another account');
        }

        admin.phoneNumber = trimmedPhone;
      }
    }

    await admin.save();

    return {
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      role: admin.role,
      society: admin.society
        ? {
            id: admin.society.id,
            name: admin.society.name,
          }
        : undefined,
      lastLogin: admin.lastLogin || null,
    };
  }
}
