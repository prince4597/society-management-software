import { Transaction } from 'sequelize';
import { sequelize } from '../../config/database';
import { adminRepository } from '../admin/repository';
import { logger } from '../../utils/logger';
import { ConflictError, NotFoundError } from '../../middleware/errors';
import { RoleName } from '../../constants/roles';
import { BaseService } from '../../core/base.service';
import { societyRepository, SocietyRepository } from './repository';
import type { CreateSocietyInput, UpdateSocietyInput } from './dto';
import type { SocietyAttributes } from '../../models/society.model';
import type { AdminAttributes } from '../../models/admin.model';

export interface OnboardResult {
  society: SocietyAttributes;
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface SocietyDetailResult extends SocietyAttributes {
  admins: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    role: string;
  }>;
}

interface SocietyWithAdmins extends SocietyAttributes {
  admins?: AdminAttributes[];
}

class SocietyService extends BaseService<
  SocietyAttributes,
  CreateSocietyInput['society'],
  UpdateSocietyInput,
  string
> {
  protected override readonly repository: SocietyRepository;

  constructor() {
    super(societyRepository, 'Society');
    this.repository = societyRepository;
  }

  async onboardSociety(input: CreateSocietyInput): Promise<OnboardResult> {
    const { society: societyData, admin: adminData } = input;

    const existingCode = await this.recordExists({ code: societyData.code.trim().toUpperCase() });
    if (existingCode) {
      throw new ConflictError(`Society with code "${societyData.code}" already exists`);
    }

    const existingEmail = await adminRepository.findOne({
      where: { email: adminData.email } as Record<string, unknown>,
      paranoid: false,
    });
    if (existingEmail) {
      throw new ConflictError(`Admin with email "${adminData.email}" already exists`);
    }

    const existingPhone = await adminRepository.findOne({
      where: { phoneNumber: adminData.phoneNumber } as Record<string, unknown>,
      paranoid: false,
    });
    if (existingPhone) {
      throw new ConflictError(`Admin with phone "${adminData.phoneNumber}" already exists`);
    }

    const transaction: Transaction = await sequelize.transaction();

    try {
      const societyModel = await societyRepository.getModel().create(
        {
          name: societyData.name.trim(),
          code: societyData.code.trim().toUpperCase(),
          address: societyData.address.trim(),
          city: societyData.city.trim(),
          state: societyData.state.trim(),
          country: societyData.country?.trim() || 'India',
          zipCode: societyData.zipCode.trim(),
          email: societyData.email?.trim() || undefined,
          phone: societyData.phone?.trim(),
          totalFlats: societyData.totalFlats || 0,
        },
        { transaction }
      );

      const adminModel = await adminRepository.getModel().create(
        {
          role: RoleName.SOCIETY_ADMIN,
          societyId: societyModel.id,
          firstName: adminData.firstName.trim(),
          lastName: adminData.lastName.trim(),
          email: adminData.email.trim(),
          phoneNumber: adminData.phoneNumber.trim(),
          password: adminData.password,
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(`Society "${societyModel.name}" onboarded with admin ${adminModel.email}`);

      return {
        society: societyModel.toJSON(),
        admin: {
          id: adminModel.id,
          email: adminModel.email,
          firstName: adminModel.firstName,
          lastName: adminModel.lastName,
        },
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Society onboarding failed:', error);
      throw error;
    }
  }

  private async recordExists(where: Record<string, unknown>): Promise<boolean> {
    const count = await this.repository.count(where);
    return count > 0;
  }

  async getSocietyDetails(id: string): Promise<SocietyDetailResult> {
    const society = (await this.repository.findOne({
      where: { id } as Record<string, unknown>,
      include: [
        {
          model: adminRepository.getModel(),
          as: 'admins',
          attributes: { exclude: ['password'] },
        },
      ],
    })) as SocietyWithAdmins | null;

    if (!society) {
      throw new NotFoundError('Society', id);
    }

    return {
      ...society,
      admins: (society.admins || []).map((admin) => ({
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        isActive: admin.isActive,
        role: admin.role,
      })),
    };
  }

  async getAdmins(societyId: string): Promise<AdminAttributes[]> {
    return adminRepository.findAll({
      where: { societyId } as Record<string, unknown>,
    });
  }
}

export const societyService = new SocietyService();
