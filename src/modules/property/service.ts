import { Op, WhereOptions } from 'sequelize';
import { PaginatedResult, PaginationParams, ServiceResponse } from '../../types';
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

  async findAllPaginatedInSociety(
    societyId: string,
    pagination: Partial<PaginationParams & { search?: string }>
  ): Promise<PaginatedResult<PropertyAttributes>> {
    const response = await this.findAllPaginated({
      societyId,
      search: pagination.search,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        sortBy: pagination.sortBy || 'createdAt',
        sortOrder: pagination.sortOrder || 'DESC',
      },
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

    const paginatedResult = response.data!;

    if (paginatedResult.data.length > 0) {
      // Get all resident IDs linked to these properties (owners + tenants)
      const residentIds = paginatedResult.data.reduce((acc, p) => {
        if (p.ownerId) acc.add(p.ownerId);
        if (p.tenantId) acc.add(p.tenantId);
        return acc;
      }, new Set<string>());

      const propertyIds = paginatedResult.data.map(p => p.id);

      // Fetch residents who either are owners/tenants OR have these properties in their flatIds
      const potentialLinkedResidents = await residentRepository.findAll({
        where: {
          societyId,
          [Op.or]: [
            { id: Array.from(residentIds) },
            { flatIds: { [Op.overlap]: propertyIds } }
          ]
        } as Record<string, unknown>
      });

      paginatedResult.data = await this.enrichPropertiesWithResidents(paginatedResult.data, potentialLinkedResidents);
    }

    return paginatedResult;
  }

  private async enrichPropertiesWithResidents(
    properties: PropertyAttributes[],
    potentialResidents: ResidentAttributes[]
  ): Promise<PropertyWithResidents[]> {
    return properties.map((p) => {
      const propertyWithResidents = { ...p } as PropertyWithResidents;
      propertyWithResidents.residents = potentialResidents
        .filter(
          (r) =>
            (r.flatIds || []).includes(p.id) ||
            r.id === p.ownerId ||
            r.id === p.tenantId
        )
        .map(r => ({
          id: r.id,
          firstName: r.firstName,
          lastName: r.lastName,
          role: r.role,
          isResident: r.isResident,
          profileImage: r.profileImage,
        } as ResidentAttributes)); // PII Protection: only expose necessary info in list
      return propertyWithResidents;
    });
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
    });

    const properties = response.data!;
    if (properties.length === 0) return [];

    const residentIds = properties.reduce((acc, p) => {
      if (p.ownerId) acc.add(p.ownerId);
      if (p.tenantId) acc.add(p.tenantId);
      return acc;
    }, new Set<string>());

    const propertyIds = properties.map(p => p.id);

    const potentialResidents = await residentRepository.findAll({
      where: {
        societyId,
        [Op.or]: [
          { id: Array.from(residentIds) },
          { flatIds: { [Op.overlap]: propertyIds } }
        ]
      } as Record<string, unknown>
    });

    return this.enrichPropertiesWithResidents(properties, potentialResidents);
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
    if (!property.data) {
      throw new NotFoundError('Property', id);
    }

    // Logic Fix: Removing the ConflictError that blocked ownership transfers.
    // In a production app, we should allow updating the ownerId.
    // Ideally, we could add a Transfer History record here if that were in the schema.

    const response = await this.update(id, data, societyId);
    return response.data!;
  }

  async deleteFromSociety(societyId: string, id: string): Promise<void> {
    await this.delete(id, societyId);
  }
}

export const propertyService = new PropertyService();
