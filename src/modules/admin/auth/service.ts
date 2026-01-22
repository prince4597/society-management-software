import bcrypt from 'bcrypt';
import Admin from '../../../models/admin.model';
import Role from '../../../models/role.model';
import { UnauthorizedError } from '../../../middleware/errors';
import { signToken } from '../../../utils/jwt';
import { LoginInput } from './dto';

export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
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
          model: Role,
          as: 'role',
          attributes: ['name'],
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
      role: admin.role?.name || 'UNKNOWN',
    });

    return {
      token,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        role: admin.role?.name || 'UNKNOWN',
        lastLogin: admin.lastLogin || null,
      },
    };
  }

  public async getProfile(adminId: string): Promise<AdminProfile> {
    const admin = await Admin.findByPk(adminId, {
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
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
      role: admin.role?.name || 'UNKNOWN',
      lastLogin: admin.lastLogin || null,
    };
  }
}
