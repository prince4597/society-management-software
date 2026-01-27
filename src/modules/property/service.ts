import { Op, WhereOptions } from 'sequelize';
import { NotFoundError, ConflictError } from '../../middleware/errors';
import { BaseService } from '../../core/base.service';
import { propertyRepository, PropertyRepository } from './repository';
import { residentRepository } from '../resident/repository';
import type { CreatePropertyInput, UpdatePropertyInput } from './dto';
import type { PropertyAttributes } from '../../models/property.model';
import type { ResidentAttributes } from '../../models/resident.model';

/**
 * Extended Property type that includes linked residents
 * Used for API responses that need resident data
 */
interface PropertyWithResidents extends PropertyAttributes {
  residents: ResidentAttributes[];
}

class PropertyService extends BaseService<
  PropertyAttributes,
  CreatePropertyInput,
  UpdatePropertyInput,
  string
> {
  protected override readonly repository: PropertyRepository;

  constructor() {
    super(propertyRepository, 'Property');
    this.repository = propertyRepository;
  }

  async createInSociety(
    societyId: string,
    input: CreatePropertyInput
  ): Promise<PropertyAttributes> {
    const response = await this.create(input, societyId);
    return response.data!;
  }

  async findAllInSociety(societyId: string): Promise<PropertyAttributes[]> {
    const response = await this.findAll({
      societyId,
      include: [
        {
          model: residentRepository.getModel(),
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
        },
        {
          model: residentRepository.getModel(),
          as: 'tenant',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
        },
      ],
      where: { societyId } as Record<string, unknown>,
    });

    const properties = response.data!;
    const residents = await residentRepository.findAll({ societyId });

    return properties.map((p) => {
      const propertyWithResidents = p as PropertyWithResidents;
      propertyWithResidents.residents = residents.filter(
        (r) =>
          (r.flatIds || []).includes(p.id) ||
          r.id === p.ownerId ||
          r.id === p.tenantId
      );
      return propertyWithResidents;
    });
  }

  async findByIdInSociety(societyId: string, id: string): Promise<PropertyWithResidents> {
    const property = await this.repository.findOne({
      where: { id, societyId } as Record<string, unknown>,
      include: [
        {
          model: residentRepository.getModel(),
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
        },
        {
          model: residentRepository.getModel(),
          as: 'tenant',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
        },
      ],
    });

    if (!property) {
      throw new NotFoundError('Property', id);
    }

    const whereClause: WhereOptions = {
      societyId,
      [Op.or]: [
        { id: property.ownerId || '00000000-0000-0000-0000-000000000000' },
        { id: property.tenantId || '00000000-0000-0000-0000-000000000000' },
        {
          flatIds: {
            [Op.contains]: [id],
          },
        },
      ],
    };

    const linkedResidents = await residentRepository.findAll({
      where: whereClause as Record<string, unknown>,
      societyId
    });

    return {
      ...property,
      residents: linkedResidents,
    } as PropertyWithResidents;
  }

  async updateInSociety(
    societyId: string,
    id: string,
    data: UpdatePropertyInput
  ): Promise<PropertyAttributes> {
    const property = await this.findById(id, societyId);

    if (data.ownerId && property.data!.ownerId && data.ownerId !== property.data!.ownerId) {
      throw new ConflictError(
        `Property ${property.data!.number} already has an owner assigned. Each unit can have only one owner.`
      );
    }

    const response = await this.update(id, data, societyId);
    return response.data!;
  }

  async deleteFromSociety(societyId: string, id: string): Promise<void> {
    await this.delete(id, societyId);
  }
}

export const propertyService = new PropertyService();
