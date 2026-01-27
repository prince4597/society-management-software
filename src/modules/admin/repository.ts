import { Admin } from '../../models';
import { BaseRepository } from '../../core/base.repository';
import type { AdminAttributes, AdminCreationAttributes } from '../../models/admin.model';

export class AdminRepository extends BaseRepository<
  Admin,
  AdminAttributes,
  AdminCreationAttributes,
  Partial<AdminAttributes>,
  string
> {
  constructor() {
    super(Admin, 'Admin');
  }

  async findByEmail(email: string): Promise<AdminAttributes | null> {
    return this.findOne({
      where: { email, isActive: true } as Record<string, unknown>,
    });
  }
}

export const adminRepository = new AdminRepository();
