import Admin, { AdminCreationAttributes } from '../models/admin.model';
import { RoleName } from '../constants/roles';

export class TestFactory {
  static async createAdmin(overrides: Partial<AdminCreationAttributes> = {}): Promise<Admin> {
    return Admin.create({
      firstName: 'Test',
      lastName: 'User',
      email: `test-${Date.now()}@example.com`,
      password: overrides.password || 'password123',
      phoneNumber: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      role: RoleName.SOCIETY_ADMIN,
      isActive: true,
      ...overrides,
    } as AdminCreationAttributes);
  }

  static async clearAll(): Promise<void> {
    await Admin.destroy({ where: {}, force: true });
  }
}
