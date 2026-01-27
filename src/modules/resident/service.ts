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

      // 2. If flatIds are provided and it's a primary role, update property links atomically
      if (input.flatIds && input.flatIds.length > 0) {
        const isPrimaryRole = input.role === ResidentRole.PRIMARY_OWNER || input.role === ResidentRole.TENANT;

        if (isPrimaryRole) {
          const occupancyStatus = input.role === ResidentRole.TENANT
            ? OccupancyStatus.RENTED
            : OccupancyStatus.OWNER_OCCUPIED;

          const updateData: Record<string, any> = { occupancyStatus };
          if (input.role === ResidentRole.TENANT) {
            updateData.tenantId = resident.id;
          } else {
            updateData.ownerId = resident.id;
          }

          await propertyRepository.getModel().update(updateData, {
            where: {
              id: input.flatIds,
              societyId
            },
            transaction
          });
        }
      }

      await transaction.commit();
      return resident.toJSON() as ResidentAttributes;
    } catch (error) {
      await transaction.rollback();
      throw error;
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
