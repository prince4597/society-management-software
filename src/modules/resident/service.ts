import { ConflictError, NotFoundError } from '../../middleware/errors';
import { BaseService } from '../../core/base.service';
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

  async findAllInSociety(societyId: string): Promise<ResidentAttributes[]> {
    const response = await this.findAll({
      societyId,
      include: [
        {
          model: propertyRepository.getModel(),
          as: 'ownedProperties',
          attributes: ['id', 'number', 'block', 'floor'],
        },
        {
          model: propertyRepository.getModel(),
          as: 'rentedProperties',
          attributes: ['id', 'number', 'block', 'floor'],
        },
      ],
      where: { societyId } as Record<string, unknown>,
    });
    return response.data!;
  }

  async findByIdInSociety(societyId: string, id: string): Promise<ResidentAttributes> {
    const resident = await this.repository.findOne({
      where: { id, societyId } as Record<string, unknown>,
      include: [
        {
          model: propertyRepository.getModel(),
          as: 'ownedProperties',
          attributes: ['id', 'number', 'block', 'floor'],
        },
        {
          model: propertyRepository.getModel(),
          as: 'rentedProperties',
          attributes: ['id', 'number', 'block', 'floor'],
        },
      ],
    });

    if (!resident) throw new NotFoundError('Resident', id);
    return resident;
  }

  async deleteFromSociety(societyId: string, id: string): Promise<void> {
    await this.delete(id, societyId);
  }
}

export const residentService = new ResidentService();
