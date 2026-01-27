import { Op, WhereOptions } from 'sequelize';
import { Property, Resident } from '../../models';
import { logger } from '../../utils/logger';
import { NotFoundError, ConflictError } from '../../middleware/errors';
import { BaseService } from '../../core/base.service';
import { propertyRepository, PropertyRepository } from './repository';
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
    const property = await this.repository.create({
      ...input,
      societyId,
    } as CreatePropertyInput & { societyId: string });

    logger.info(`Property ${property.id} created for society ${societyId}`);
    return property;
  }

  async findAllInSociety(societyId: string): Promise<PropertyAttributes[]> {
    const properties = await Property.findAll({
      where: { societyId },
      include: [
        {
          model: Resident,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
        },
        {
          model: Resident,
          as: 'tenant',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
        },
      ],
      order: [
        ['block', 'ASC'],
        ['floor', 'ASC'],
        ['number', 'ASC'],
      ],
    });

    // Fetch all residents for this society to map them in memory (N+1 avoidance)
    const residents = await Resident.findAll({ where: { societyId } });

    return properties.map((property) => {
      const p = property.toJSON();
      // Discovery inhabitants who have this flat ID in their flatIds JSONB array
      p.residents = residents
        .filter(
          (r) =>
            (r.flatIds || []).includes(property.id) ||
            r.id === property.ownerId ||
            r.id === property.tenantId
        )
        .map((r) => r.toJSON());
      return p;
    });
  }

  async findByIdInSociety(societyId: string, id: string): Promise<PropertyWithResidents> {
    const property = await Property.findOne({
      where: { id, societyId },
      include: [
        {
          model: Resident,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
        },
        {
          model: Resident,
          as: 'tenant',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
        },
      ],
    });

    if (!property) {
      throw new NotFoundError('Property', id);
    }

    // Find all residents who live here (Owners, Tenants, or Family linked via flatIds)
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

    const linkedResidents = await Resident.findAll({ where: whereClause });

    // Create typed response object
    const propertyData = property.toJSON();
    return {
      ...propertyData,
      residents: linkedResidents.map((r) => r.toJSON()),
    } as PropertyWithResidents;
  }

  async updateInSociety(
    societyId: string,
    id: string,
    data: UpdatePropertyInput
  ): Promise<PropertyAttributes> {
    const propertyModel = await Property.findOne({ where: { id, societyId } });
    if (!propertyModel) throw new NotFoundError('Property', id);

    // Enforce "One Unit, One Owner" rule
    if (data.ownerId && propertyModel.ownerId && data.ownerId !== propertyModel.ownerId) {
      throw new ConflictError(
        `Property ${propertyModel.number} already has an owner assigned. Each unit can have only one owner.`
      );
    }

    const updated = await propertyModel.update(data);
    logger.info(`Property ${id} updated`);
    return updated.toJSON();
  }

  async deleteFromSociety(societyId: string, id: string): Promise<void> {
    const affected = await Property.destroy({ where: { id, societyId } });
    if (affected === 0) throw new NotFoundError('Property', id);
    logger.info(`Property ${id} deleted from society ${societyId}`);
  }
}

export const propertyService = new PropertyService();
