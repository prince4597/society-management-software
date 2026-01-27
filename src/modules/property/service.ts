import { Op } from 'sequelize';
import { Property, Resident } from '../../models';
import { logger } from '../../utils/logger';
import { NotFoundError, ConflictError } from '../../middleware/errors';
import type { CreatePropertyInput, UpdatePropertyInput } from './dto';

class PropertyService {
  async create(societyId: string, input: CreatePropertyInput): Promise<Property> {
    const property = await Property.create({
      ...input,
      societyId,
    });

    logger.info(`Property ${property.id} created for society ${societyId}`);
    return property;
  }

  async findAll(societyId: string): Promise<Property[]> {
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

    return properties.map(property => {
      const p = property;
      // Discovery inhabitants who have this flat ID in their flatIds JSONB array
      p.residents = residents.filter(r =>
        (r.flatIds || []).includes(property.id) ||
        r.id === property.ownerId ||
        r.id === property.tenantId
      );
      return p;
    });
  }

  async findById(societyId: string, id: string): Promise<Property> {
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
    const linkedResidents = await Resident.findAll({
      where: {
        societyId,
        [Op.or]: [
          { id: property.ownerId || '00000000-0000-0000-0000-000000000000' },
          { id: property.tenantId || '00000000-0000-0000-0000-000000000000' },
          {
            flatIds: {
              [Op.contains]: [id]
            }
          }
        ]
      } as any
    });

    const propertyData = property.get({ plain: true });
    propertyData.residents = linkedResidents;
    return propertyData as any;
  }

  async update(societyId: string, id: string, data: UpdatePropertyInput): Promise<Property> {
    const property = await Property.findOne({ where: { id, societyId } });
    if (!property) throw new NotFoundError('Property', id);

    // Enforce "One Unit, One Owner" rule
    if (data.ownerId && property.ownerId && data.ownerId !== property.ownerId) {
      throw new ConflictError(
        `Property ${property.number} already has an owner assigned. Each unit can have only one owner.`
      );
    }

    await property.update(data);
    logger.info(`Property ${id} updated`);
    return property;
  }

  async delete(societyId: string, id: string): Promise<void> {
    const property = await Property.findOne({ where: { id, societyId } });
    if (!property) throw new NotFoundError('Property', id);
    await property.destroy();
    logger.info(`Property ${id} deleted`);
  }
}

export const propertyService = new PropertyService();
