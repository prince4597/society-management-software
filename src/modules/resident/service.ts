import { Resident, Property } from '../../models';
import { logger } from '../../utils/logger';
import { NotFoundError, ConflictError } from '../../middleware/errors';
import type { CreateResidentInput, UpdateResidentInput } from './dto';

class ResidentService {
  async create(societyId: string, input: CreateResidentInput): Promise<Resident> {
    const existing = await Resident.findOne({
      where: { email: input.email, societyId },
    });
    if (existing) {
      throw new ConflictError(
        `Resident with email "${input.email}" already exists in this society`
      );
    }

    const resident = await Resident.create({
      ...input,
      societyId,
    });

    logger.info(`Resident ${resident.id} created for society ${societyId}`);
    return resident;
  }

  async findAll(societyId: string): Promise<Resident[]> {
    return Resident.findAll({
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
  }

  async findById(societyId: string, id: string): Promise<Resident> {
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

    return resident;
  }

  async update(societyId: string, id: string, data: UpdateResidentInput): Promise<Resident> {
    const resident = await this.findById(societyId, id);
    await resident.update(data);
    logger.info(`Resident ${id} updated`);
    return resident;
  }

  async delete(societyId: string, id: string): Promise<void> {
    const resident = await this.findById(societyId, id);
    await resident.destroy();
    logger.info(`Resident ${id} deleted`);
  }
}

export const residentService = new ResidentService();
