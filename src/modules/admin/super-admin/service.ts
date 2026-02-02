import { adminRepository } from '../repository';
import { societyRepository } from '../../society/repository';
import { NotFoundError, BadRequestError } from '../../../middleware/errors';
import { logger } from '../../../utils/logger';
import { RoleName } from '../../../constants/roles';
import type { AdminAttributes } from '../../../models/admin.model';

export interface AdminNodeData {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password?: string;
}

export interface UpdateAdminData {
  isActive?: boolean;
}

export type AdminResponse = Omit<AdminAttributes, 'password'>;

class SuperAdminService {
  async addAdmin(societyId: string, data: AdminNodeData): Promise<AdminResponse> {
    const society = await societyRepository.findById(societyId);
    if (!society) {
      throw new NotFoundError('Society', societyId);
    }

    const { email, phoneNumber, firstName, lastName, password } = data;

    const phoneRegex = /^\+\d{2}\s\d{10}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber.trim())) {
      throw new BadRequestError(
        'Invalid phone format. Protocol: +CC XXXXXXXXXX (e.g. +91 9876543210)'
      );
    }

    const existingAdmin = await adminRepository.findOne({
      where: { email } as Record<string, unknown>,
      paranoid: false,
    });

    if (existingAdmin) {
      if (existingAdmin.deletedAt) {
        // Restore and update soft-deleted admin
        const adminModel = await adminRepository
          .getModel()
          .findByPk(existingAdmin.id, { paranoid: false });
        if (!adminModel) throw new NotFoundError('Admin', existingAdmin.id);

        await adminModel.restore();
        await adminModel.update({
          firstName,
          lastName,
          phoneNumber,
          password,
          societyId,
          role: RoleName.SOCIETY_ADMIN,
          isActive: true,
        });

        logger.info(`Super Admin restored soft-deleted admin ${email} for society ${societyId}`);
        const adminJson = adminModel.toJSON();
        const { password: _password, ...rest } = adminJson;
        return rest;
      }

      const otherSocietyId = existingAdmin.societyId;
      const otherSociety = otherSocietyId ? await societyRepository.findById(otherSocietyId) : null;
      const societyMsg = otherSociety
        ? `active in society "${otherSociety.name}"`
        : 'already exists';
      throw new BadRequestError(`Admin with email "${email}" ${societyMsg}`);
    }

    const existingPhone = await adminRepository.findOne({
      where: { phoneNumber } as Record<string, unknown>,
      paranoid: false,
    });
    if (existingPhone && !existingPhone.deletedAt) {
      throw new BadRequestError(`Admin with phone "${phoneNumber}" already exists`);
    }

    const admin = await adminRepository.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      societyId,
      role: RoleName.SOCIETY_ADMIN,
      isActive: true,
    });

    logger.info(`Super Admin added new admin ${email} for society ${societyId}`);

    const { password: _password, ...adminJson } = admin;
    return adminJson;
  }

  async updateAdmin(adminId: string, data: UpdateAdminData): Promise<AdminResponse> {
    const admin = await adminRepository.findById(adminId);
    if (!admin) {
      throw new NotFoundError('Admin', adminId);
    }

    const updateData: Partial<AdminAttributes> = {};
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    const updated = await adminRepository.update(adminId, updateData);
    if (!updated) {
      throw new NotFoundError('Admin', adminId);
    }

    logger.info(`Admin ${adminId} updated by Super Admin`);

    const { password: _password, ...adminJson } = updated;
    return adminJson;
  }

  async deleteAdmin(adminId: string): Promise<{ message: string }> {
    const affected = await adminRepository.delete(adminId);
    if (!affected) {
      throw new NotFoundError('Admin', adminId);
    }

    logger.info(`Admin ${adminId} soft-deleted by Super Admin`);
    return { message: 'Admin deleted successfully' };
  }
}

export const superAdminService = new SuperAdminService();
