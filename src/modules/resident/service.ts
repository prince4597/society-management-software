import { Op } from 'sequelize';
import { ConflictError, NotFoundError } from '../../middleware/errors';
import { BaseService } from '../../core/base.service';
import { PaginatedResult, PaginationParams } from '../../types';
import { residentRepository, ResidentRepository } from './repository';
import { propertyRepository } from '../property/repository';
import type { CreateResidentInput, UpdateResidentInput } from './dto';
import type { ResidentAttributes } from '../../models/resident.model';

class ResidentService extends BaseService<
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

    const response = await this.create(input, societyId);
    return response.data!;
  }

  async findAllPaginatedInSociety(
    societyId: string,
    pagination: Partial<PaginationParams>
  ): Promise<PaginatedResult<ResidentAttributes>> {
    const response = await this.findAllPaginated({
      societyId,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 20,
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
    const allResidents = await this.repository.findAll({ societyId });

    paginatedResult.data = this.enrichResidents(paginatedResult.data, allResidents);

    return paginatedResult;
  }

  private enrichResidents(
    residents: ResidentAttributes[],
    allResidents: ResidentAttributes[]
  ): ResidentAttributes[] {
    return residents.map((r) => {
      const residentData = { ...r };
      const flatIds = residentData.flatIds || [];

      if (flatIds.length > 0) {
        residentData.coHabitants = allResidents.filter(
          (other) =>
            other.id !== r.id &&
            (other.flatIds || []).some((fid) => flatIds.includes(fid))
        );
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
    const allResidents = await this.repository.findAll({ societyId });

    return this.enrichResidents(residents, allResidents);
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
