import Admin, { AdminCreationAttributes } from '../models/admin.model';
import Resident, { ResidentAttributes, ResidentRole } from '../models/resident.model';
import Property, { PropertyAttributes, OccupancyStatus } from '../models/property.model';
import Society from '../models/society.model';
import { RoleName } from '../constants/roles';
import { randomUUID } from 'crypto';

export class TestFactory {
  static async createSociety(overrides: any = {}): Promise<any> {
    return Society.create({
      name: 'Test Society',
      address: '123 Test St',
      ...overrides,
    });
  }

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

  static async createResident(overrides: Partial<ResidentAttributes> = {}): Promise<Resident> {
    return Resident.create({
      firstName: 'Resident',
      lastName: 'User',
      email: `resident-${randomUUID()}@example.com`,
      phoneNumber: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      role: ResidentRole.PRIMARY_OWNER,
      isResident: true,
      flatIds: [],
      ...overrides,
    } as any);
  }

  static async createProperty(overrides: Partial<PropertyAttributes> = {}): Promise<Property> {
    return Property.create({
      number: '101',
      floor: 1,
      block: 'A',
      occupancyStatus: OccupancyStatus.VACANT,
      ...overrides,
    } as any);
  }

  static async clearAll(): Promise<void> {
    await Resident.destroy({ where: {}, force: true });
    await Property.destroy({ where: {}, force: true });
    await Admin.destroy({ where: {}, force: true });
    await Society.destroy({ where: {}, force: true });
  }
}
