import { Op, Transaction } from 'sequelize';
import { sequelize } from '../../config/database';
import { ConflictError, NotFoundError } from '../../middleware/errors';
import { BaseService } from '../../core/base.service';
import { PaginatedResult, PaginationParams } from '../../types';
import { residentRepository, ResidentRepository } from './repository';
import { propertyRepository } from '../property/repository';
import { ResidentRole } from '../../models/resident.model';
import { OccupancyStatus } from '../../models/property.model';
import type { CreateResidentInput, UpdateResidentInput } from './dto';
import type { ResidentAttributes } from '../../models/resident.model';

export class ResidentService extends BaseService<
  ResidentAttributes,
  CreateResidentInput,
  UpdateResidentInput,
  string
> {
  protected override readonly repository: ResidentRepository;

  constructor() {
    super(residentRepository, 'Resident');
    this.repository = residentRepository;
  }

  async createWithSociety(
    societyId: string,
    input: CreateResidentInput
  ): Promise<ResidentAttributes> {
    const existing = await this.repository.findByEmail(input.email, societyId);
    if (existing) {
      throw new ConflictError(
        `Resident with email "${input.email}" already exists in this society`
      );
    }

    const transaction: Transaction = await sequelize.transaction();

    try {
      // 1. Create the resident
      const resident = await this.repository.getModel().create({
        ...input,
        societyId,
      }, { transaction });

      // 2. Synchronize property links
      await this.syncPropertyLinks(resident.id, societyId, input.role, input.flatIds || [], transaction);

      await transaction.commit();
      return resident.toJSON() as ResidentAttributes;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateInSociety(
    societyId: string,
    id: string,
    input: UpdateResidentInput
  ): Promise<ResidentAttributes> {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const resident = await this.repository.getModel().findOne({
        where: { id, societyId },
        transaction
      });

      if (!resident) throw new NotFoundError('Resident', id);

      const oldRole = resident.role;
      const oldFlatIds = resident.flatIds || [];

      await resident.update(input, { transaction });

      // If role or flatIds changed, sync property links
      if (input.role !== undefined || input.flatIds !== undefined) {
        await this.syncPropertyLinks(
          id,
          societyId,
          input.role || oldRole,
          input.flatIds || oldFlatIds,
          transaction
        );
      }

      await transaction.commit();
      return resident.toJSON() as ResidentAttributes;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async syncPropertyLinks(
    residentId: string,
    societyId: string,
    role: ResidentRole,
    currentFlatIds: string[],
    transaction: Transaction
  ): Promise<void> {
    const isPrimaryRole = role === ResidentRole.PRIMARY_OWNER || role === ResidentRole.TENANT;

    // 1. Unlink from ALL properties where this resident was previously owner/tenant
    // This ensures no ghost links remain if the resident is moved or downgraded
    await propertyRepository.getModel().update(
      { ownerId: null, occupancyStatus: OccupancyStatus.VACANT },
      { where: { ownerId: residentId, societyId }, transaction }
    );
    await propertyRepository.getModel().update(
      { tenantId: null, occupancyStatus: OccupancyStatus.VACANT },
      { where: { tenantId: residentId, societyId }, transaction }
    );

    // 2. If it's a primary role and there are flats, establish NEW links
    if (isPrimaryRole && currentFlatIds.length > 0) {
      const occupancyStatus = role === ResidentRole.TENANT
        ? OccupancyStatus.RENTED
        : OccupancyStatus.OWNER_OCCUPIED;

      const updateData: Record<string, any> = { occupancyStatus };
      if (role === ResidentRole.TENANT) {
        updateData.tenantId = residentId;
      } else {
        updateData.ownerId = residentId;
      }

      await propertyRepository.getModel().update(updateData, {
        where: {
          id: currentFlatIds,
          societyId
        },
        transaction
      });
    }
  }

  async findAllPaginatedInSociety(
    societyId: string,
    pagination: Partial<PaginationParams>
  ): Promise<PaginatedResult<ResidentAttributes>> {
    const response = await this.findAllPaginated({
      societyId,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        sortBy: pagination.sortBy || 'createdAt',
        sortOrder: pagination.sortOrder || 'DESC',
      },
      include: [
        {
          model: propertyRepository.getModel(),
          as: 'ownedProperties',
          attributes: ['id', 'number', 'block', 'floor', 'unitType'],
        },
        {
          model: propertyRepository.getModel(),
          as: 'rentedProperties',
          attributes: ['id', 'number', 'block', 'floor', 'unitType'],
        },
      ],
    });

    const paginatedResult = response.data!;

    if (paginatedResult.data.length > 0) {
      // Get all flat IDs from the current page of residents
      const allFlatIds = paginatedResult.data.reduce((acc, r) => {
        return [...acc, ...(r.flatIds || [])];
      }, [] as string[]);

      const uniqueFlatIds = Array.from(new Set(allFlatIds));

      if (uniqueFlatIds.length > 0) {
        // Fetch only residents that share these flats
        // Restrict attributes to protect PII in nested relations
        const potentialCoHabitants = await this.repository.findAll({
          where: {
            societyId,
            flatIds: { [Op.overlap]: uniqueFlatIds }
          } as Record<string, unknown>,
          include: [] // Ensure no deep relations are fetched for co-habitants
        });

        paginatedResult.data = this.enrichResidents(paginatedResult.data, potentialCoHabitants);
      } else {
        paginatedResult.data = paginatedResult.data.map(r => ({ ...r, coHabitants: [] }));
      }
    }

    return paginatedResult;
  }

  private enrichResidents(
    residents: ResidentAttributes[],
    potentialCoHabitants: ResidentAttributes[]
  ): ResidentAttributes[] {
    return residents.map((r) => {
      const residentData = { ...r };
      const flatIds = residentData.flatIds || [];

      if (flatIds.length > 0) {
        residentData.coHabitants = potentialCoHabitants
          .filter(
            (other) =>
              other.id !== r.id &&
              (other.flatIds || []).some((fid) => flatIds.includes(fid))
          )
          .map(other => ({
            id: other.id,
            firstName: other.firstName,
            lastName: other.lastName,
            role: other.role,
            isResident: other.isResident,
            profileImage: other.profileImage,
          } as ResidentAttributes)); // Restrict to non-sensitive fields
      } else {
        residentData.coHabitants = [];
      }

      return residentData;
    });
  }

  async findAllInSociety(societyId: string): Promise<ResidentAttributes[]> {
    const response = await this.findAll({
      societyId,
      include: [
        {
          model: propertyRepository.getModel(),
          as: 'ownedProperties',
          attributes: ['id', 'number', 'block', 'floor', 'unitType'],
        },
        {
          model: propertyRepository.getModel(),
          as: 'rentedProperties',
          attributes: ['id', 'number', 'block', 'floor', 'unitType'],
        },
      ],
      where: { societyId } as Record<string, unknown>,
    });

    const residents = response.data!;

    if (residents.length === 0) return [];

    const allFlatIds = residents.reduce((acc, r) => [...acc, ...(r.flatIds || [])], [] as string[]);
    const uniqueFlatIds = Array.from(new Set(allFlatIds));

    if (uniqueFlatIds.length > 0) {
      const potentialCoHabitants = await this.repository.findAll({
        where: {
          societyId,
          flatIds: { [Op.overlap]: uniqueFlatIds }
        } as Record<string, unknown>
      });
      return this.enrichResidents(residents, potentialCoHabitants);
    }

    return residents.map(r => ({ ...r, coHabitants: [] }));
  }

  async findByIdInSociety(societyId: string, id: string): Promise<ResidentAttributes> {
    const resident = await this.repository.findOne({
      where: { id, societyId } as Record<string, unknown>,
      include: [
        {
          model: propertyRepository.getModel(),
          as: 'ownedProperties',
          attributes: ['id', 'number', 'block', 'floor', 'unitType'],
        },
        {
          model: propertyRepository.getModel(),
          as: 'rentedProperties',
          attributes: ['id', 'number', 'block', 'floor', 'unitType'],
        },
      ],
    });

    if (!resident) throw new NotFoundError('Resident', id);

    const residentData = resident as unknown as ResidentAttributes;

    // Discover co-habitants (other residents linked to the same flats)
    if (residentData.flatIds && residentData.flatIds.length > 0) {
      const coHabitants = await this.repository.findAll({
        where: {
          societyId,
          id: { [Op.ne]: id },
          flatIds: {
            [Op.overlap]: residentData.flatIds,
          },
        } as Record<string, unknown>,
      });
      residentData.coHabitants = coHabitants;
    } else {
      residentData.coHabitants = [];
    }

    return residentData;
  }

  async deleteFromSociety(societyId: string, id: string): Promise<void> {
    await this.delete(id, societyId);
  }
}

export const residentService = new ResidentService();
