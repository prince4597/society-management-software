import { Admin, Society } from '../../../models';
import { NotFoundError, BadRequestError } from '../../../middleware/errors';
import { logger } from '../../../utils/logger';
import { RoleName } from '../../../constants/roles';

export interface AdminNodeData {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password?: string;
  [key: string]: unknown;
}

export interface UpdateAdminData {
  isActive?: boolean;
  [key: string]: unknown;
}

class SuperAdminService {
  async addAdmin(societyId: string, data: AdminNodeData): Promise<Record<string, unknown>> {
    const society = await Society.findByPk(societyId);
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

    const existingAdmin = await Admin.findOne({
      where: { email },
      paranoid: false,
    });

    if (existingAdmin) {
      if (existingAdmin.deletedAt) {
        // Restore and update soft-deleted admin
        await existingAdmin.restore();
        await existingAdmin.update({
          firstName,
          lastName,
          phoneNumber,
          password,
          societyId,
          role: RoleName.SOCIETY_ADMIN,
          isActive: true,
        });

        logger.info(`Super Admin restored soft-deleted admin ${email} for society ${societyId}`);
        const adminJson = existingAdmin.toJSON() as unknown as Record<string, unknown>;
        delete adminJson.password;
        return adminJson;
      }

      const otherSociety = await Society.findByPk(existingAdmin.societyId);
      const societyMsg = otherSociety
        ? `active in society "${otherSociety.name}"`
        : 'already exists';
      throw new BadRequestError(`Admin with email "${email}" ${societyMsg}`);
    }

    const existingPhone = await Admin.findOne({
      where: { phoneNumber },
      paranoid: false,
    });
    if (existingPhone && !existingPhone.deletedAt) {
      throw new BadRequestError(`Admin with phone "${phoneNumber}" already exists`);
    }

    const admin = await Admin.create({
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

    // Return admin without password
    const adminJson = admin.toJSON() as unknown as Record<string, unknown>;
    delete adminJson.password;
    return adminJson;
  }

  async updateAdmin(adminId: string, data: UpdateAdminData): Promise<Record<string, unknown>> {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      throw new NotFoundError('Admin', adminId);
    }

    // We only want to update specific fields like isActive
    if (data.isActive !== undefined) {
      admin.isActive = data.isActive;
    }

    // Other fields can be updated here if needed in the future

    await admin.save();
    logger.info(`Admin ${adminId} updated by Super Admin`);

    const adminJson = admin.toJSON() as unknown as Record<string, unknown>;
    delete adminJson.password;
    return adminJson;
  }

  async deleteAdmin(adminId: string): Promise<{ message: string }> {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      throw new NotFoundError('Admin', adminId);
    }

    await admin.destroy(); // Soft delete because paranoid is true in model
    logger.info(`Admin ${adminId} soft-deleted by Super Admin`);
    return { message: 'Admin deleted successfully' };
  }
}

export const superAdminService = new SuperAdminService();
