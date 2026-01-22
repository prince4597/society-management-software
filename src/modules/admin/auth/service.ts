import bcrypt from 'bcrypt';
import Admin from '../../../models/admin.model';
import Role from '../../../models/role.model';
import { UnauthorizedError } from '../../../middleware/errors';
import { signToken } from '../../../utils/jwt';
import { LoginInput } from './dto';

export interface LoginResponse {
  token: string;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: string;
    lastLogin: Date | null;
  };
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
}
