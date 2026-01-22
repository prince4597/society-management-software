import Admin, { AdminCreationAttributes } from '../models/admin.model';
import Role, { RoleCreationAttributes } from '../models/role.model';

export class TestFactory {
  static async createRole(overrides: Partial<RoleCreationAttributes> = {}): Promise<Role> {
    return Role.create({
      name: 'ADMIN',
      description: 'Standard Administrator',
      ...overrides,
    } as RoleCreationAttributes);
  }

  static async createAdmin(
    roleId: string,
    overrides: Partial<AdminCreationAttributes> = {}
  ): Promise<Admin> {
    return Admin.create({
      firstName: 'Test',
      lastName: 'User',
      email: `test-${Date.now()}@example.com`,
      password: overrides.password || 'password123',
      phoneNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      roleId,
      isActive: true,
      ...overrides,
    } as AdminCreationAttributes);
  }

  static async clearAll(): Promise<void> {
    await Admin.destroy({ where: {}, force: true });
    await Role.destroy({ where: {}, force: true });
  }
}
