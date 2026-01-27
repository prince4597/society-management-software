import { Resident, Property } from '../../models';
import { logger } from '../../utils/logger';
import { ConflictError, NotFoundError } from '../../middleware/errors';
import { BaseService } from '../../core/base.service';
import { residentRepository, ResidentRepository } from './repository';
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

    const resident = await this.repository.create({
      ...input,
      societyId,
    } as CreateResidentInput & { societyId: string });

    logger.info(`Resident ${resident.id} created for society ${societyId}`);
    return resident;
  }

  async findAllInSociety(societyId: string): Promise<ResidentAttributes[]> {
    const residents = await Resident.findAll({
      where: { societyId },
      include: [
        { model: Property, as: 'ownedProperties', attributes: ['id', 'number', 'block', 'floor'] },
        { model: Property, as: 'rentedProperties', attributes: ['id', 'number', 'block', 'floor'] },
      ],
      order: [
        ['firstName', 'ASC'],
        ['lastName', 'ASC'],
      ],
    });
    return residents.map((r) => r.toJSON());
  }

  async findByIdInSociety(societyId: string, id: string): Promise<ResidentAttributes> {
    const resident = await Resident.findOne({
      where: { id, societyId },
      include: [
        { model: Property, as: 'ownedProperties', attributes: ['id', 'number', 'block', 'floor'] },
        { model: Property, as: 'rentedProperties', attributes: ['id', 'number', 'block', 'floor'] },
      ],
    });

    if (!resident) {
      throw new NotFoundError('Resident', id);
    }

    return resident.toJSON();
  }

  async deleteFromSociety(societyId: string, id: string): Promise<void> {
    const affected = await Resident.destroy({ where: { id, societyId } });
    if (affected === 0) throw new NotFoundError('Resident', id);
    logger.info(`Resident ${id} deleted from society ${societyId}`);
  }
}

export const residentService = new ResidentService();
