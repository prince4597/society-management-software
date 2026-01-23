import { Transaction } from 'sequelize';
import { sequelize } from '../../config/database';
import { Society, Admin, Role } from '../../models';
import { logger } from '../../utils/logger';
import { ConflictError, NotFoundError, BadRequestError } from '../../middleware/errors';
import type { CreateSocietyInput, UpdateSocietyInput } from './dto';
import type { SocietyAttributes } from '../../models/society.model';

const SOCIETY_ADMIN_ROLE_NAME = 'SOCIETY_ADMIN';

export interface OnboardResult {
  society: SocietyAttributes;
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

class SocietyService {
  async onboardSociety(input: CreateSocietyInput): Promise<OnboardResult> {
    const { society: societyData, admin: adminData } = input;

    const existingCode = await Society.findOne({
      where: { code: societyData.code },
      paranoid: false,
    });
    if (existingCode) {
      throw new ConflictError(`Society with code "${societyData.code}" already exists`);
    }

    const existingEmail = await Admin.findOne({
      where: { email: adminData.email },
      paranoid: false,
    });
    if (existingEmail) {
      throw new ConflictError(`Admin with email "${adminData.email}" already exists`);
    }

    const existingPhone = await Admin.findOne({
      where: { phoneNumber: adminData.phoneNumber },
      paranoid: false,
    });
    if (existingPhone) {
      throw new ConflictError(`Admin with phone "${adminData.phoneNumber}" already exists`);
    }

    const societyAdminRole = await Role.findOne({
      where: { name: SOCIETY_ADMIN_ROLE_NAME, isActive: true },
    });
    if (!societyAdminRole) {
      throw new BadRequestError('Society admin role not found in system');
    }

    const transaction: Transaction = await sequelize.transaction();

    try {
      const society = await Society.create(
        {
          name: societyData.name,
          code: societyData.code.toUpperCase(),
          address: societyData.address,
          city: societyData.city,
          state: societyData.state,
          country: societyData.country || 'India',
          zipCode: societyData.zipCode,
          email: societyData.email,
          phone: societyData.phone,
          totalFlats: societyData.totalFlats || 0,
        },
        { transaction }
      );

      const admin = await Admin.create(
        {
          roleId: societyAdminRole.id,
          societyId: society.id,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          phoneNumber: adminData.phoneNumber,
          password: adminData.password,
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(`Society "${society.name}" onboarded with admin ${admin.email}`);

      return {
        society: society.toJSON(),
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
        },
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Society onboarding failed:', error);
      throw error;
    }
  }

  async findAll(): Promise<SocietyAttributes[]> {
    const societies = await Society.findAll({
      order: [['createdAt', 'DESC']],
    });
    return societies.map((s) => s.toJSON());
  }

  async findById(id: string): Promise<SocietyAttributes> {
    const society = await Society.findByPk(id);
    if (!society) {
      throw new NotFoundError('Society', id);
    }
    return society.toJSON();
  }

  async update(id: string, data: UpdateSocietyInput): Promise<SocietyAttributes> {
    const society = await Society.findByPk(id);
    if (!society) {
      throw new NotFoundError('Society', id);
    }

    await society.update(data);
    logger.info(`Society ${id} updated`);
    return society.toJSON();
  }

  async getAdmins(societyId: string): Promise<Admin[]> {
    const society = await Society.findByPk(societyId);
    if (!society) {
      throw new NotFoundError('Society', societyId);
    }

    const admins = await Admin.findAll({
      where: { societyId },
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
      attributes: { exclude: ['password'] },
    });

    return admins;
  }
}

export const societyService = new SocietyService();
