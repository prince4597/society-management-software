import {
  Model,
  ModelStatic,
  WhereOptions,
  Order,
  FindOptions as SequelizeFindOptions,
} from 'sequelize';
import {
  IRepository,
  FindOptions,
  PaginatedResult,
  PaginationParams,
  calculatePaginationMeta,
  DEFAULT_PAGINATION,
} from '../types';
import { DatabaseError } from '../middleware/errors';
import { logger } from '../utils/logger';

export abstract class BaseRepository<
  T extends Model,
  Attributes,
  CreateDTO,
  UpdateDTO,
  ID = string | number,
> implements IRepository<Attributes, CreateDTO, UpdateDTO, ID> {
  protected readonly model: ModelStatic<T>;
  protected readonly entityName: string;
  protected readonly searchableFields: string[] = [];

  constructor(model: ModelStatic<T>, entityName: string, searchableFields: string[] = []) {
    this.model = model;
    this.entityName = entityName;
    this.searchableFields = searchableFields;
  }

  public getModel(): ModelStatic<T> {
    return this.model;
  }

  protected getScopedModel(societyId?: string): ModelStatic<T> {
    if (societyId) {
      return (this.model as any).scope({ method: ['tenant', societyId] });
    }
    return this.model;
  }

  protected buildWhereClause(
    where?: Partial<Attributes> | Record<string, unknown>,
    societyId?: string,
    search?: string
  ): WhereOptions {
    const { Op } = require('sequelize');
    const whereClause: any = { ...(where ?? {}) };

    if (societyId && !whereClause['societyId']) {
      whereClause['societyId'] = societyId;
    }

    if (search && this.searchableFields.length > 0) {
      const searchConditions = this.searchableFields.map((field) => ({
        [field]: { [Op.iLike]: `%${search}%` },
      }));

      if (whereClause[Op.and]) {
        whereClause[Op.and] = [...whereClause[Op.and], { [Op.or]: searchConditions }];
      } else {
        whereClause[Op.or] = searchConditions;
      }
    }

    return whereClause as WhereOptions;
  }

  protected buildOrderClause(pagination?: PaginationParams): Order {
    const { sortBy, sortOrder } = pagination ?? DEFAULT_PAGINATION;
    return [[sortBy, sortOrder]];
  }

  protected buildFindOptions(options?: FindOptions<Attributes>): SequelizeFindOptions {
    const findOptions: SequelizeFindOptions = {};

    if (options?.where || options?.societyId || options?.search) {
      findOptions.where = this.buildWhereClause(
        options.where,
        options.societyId,
        options.search
      ) as WhereOptions;
    }

    if (options?.include) {
      findOptions.include = options.include as SequelizeFindOptions['include'];
    }

    if (options?.pagination) {
      const { page, limit } = options.pagination;
      findOptions.offset = (page - 1) * limit;
      findOptions.limit = limit;
      findOptions.order = this.buildOrderClause(options.pagination);
    }

    if (options?.paranoid !== undefined) {
      findOptions.paranoid = options.paranoid;
    }

    return findOptions;
  }

  async findById(id: ID, societyId?: string): Promise<Attributes | null> {
    try {
      const model = this.getScopedModel(societyId);
      const record = await model.findByPk(id as any);
      return record ? (record.toJSON() as Attributes) : null;
    } catch (error) {
      logger.error(`${this.entityName}.findById failed:`, error);
      throw new DatabaseError(`Failed to find ${this.entityName}`);
    }
  }

  async findOne(options: FindOptions<Attributes>): Promise<Attributes | null> {
    try {
      const model = this.getScopedModel(options.societyId);
      const record = await model.findOne(this.buildFindOptions(options));
      return record ? (record.toJSON() as Attributes) : null;
    } catch (error) {
      logger.error(`${this.entityName}.findOne failed:`, error);
      throw new DatabaseError(`Failed to find ${this.entityName}`);
    }
  }

  async findAll(options?: FindOptions<Attributes>): Promise<Attributes[]> {
    try {
      const model = this.getScopedModel(options?.societyId);
      const records = await model.findAll(this.buildFindOptions(options));
      return records.map((record) => record.toJSON() as Attributes);
    } catch (error) {
      logger.error(`${this.entityName}.findAll failed:`, error);
      throw new DatabaseError(`Failed to fetch ${this.entityName} list`);
    }
  }

  async findAllPaginated(options: FindOptions<Attributes>): Promise<PaginatedResult<Attributes>> {
    try {
      const pagination = options.pagination ?? DEFAULT_PAGINATION;
      const model = this.getScopedModel(options.societyId);
      const { count, rows } = await model.findAndCountAll(this.buildFindOptions(options));

      return {
        data: rows.map((record) => record.toJSON() as Attributes),
        meta: calculatePaginationMeta(count, pagination.page, pagination.limit),
      };
    } catch (error) {
      logger.error(`${this.entityName}.findAllPaginated failed:`, error);
      throw new DatabaseError(`Failed to fetch ${this.entityName} list`);
    }
  }

  async create(data: CreateDTO): Promise<Attributes> {
    try {
      const record = await this.model.create(data as unknown as T['_creationAttributes']);
      return record.toJSON() as Attributes;
    } catch (error) {
      logger.error(`${this.entityName}.create failed:`, error);
      throw new DatabaseError(`Failed to create ${this.entityName}`);
    }
  }

  async update(id: ID, data: UpdateDTO, societyId?: string): Promise<Attributes | null> {
    try {
      const model = this.getScopedModel(societyId);
      const record = await model.findByPk(id as any);

      if (!record) {
        return null;
      }

      await record.update(data as any);
      return record.toJSON() as Attributes;
    } catch (error) {
      logger.error(`${this.entityName}.update failed:`, error);
      throw new DatabaseError(`Failed to update ${this.entityName}`);
    }
  }

  async delete(id: ID, societyId?: string): Promise<boolean> {
    try {
      const model = this.getScopedModel(societyId);
      const record = await model.findByPk(id as any);

      if (!record) {
        return false;
      }

      await record.destroy();
      return true;
    } catch (error) {
      logger.error(`${this.entityName}.delete failed:`, error);
      throw new DatabaseError(`Failed to delete ${this.entityName}`);
    }
  }

  async count(where?: Partial<Attributes> | Record<string, unknown>, societyId?: string): Promise<number> {
    try {
      const model = this.getScopedModel(societyId);
      return await model.count({
        where: this.buildWhereClause(where),
      });
    } catch (error) {
      logger.error(`${this.entityName}.count failed:`, error);
      throw new DatabaseError(`Failed to count ${this.entityName}`);
    }
  }

  async exists(id: ID, societyId?: string): Promise<boolean> {
    const model = this.getScopedModel(societyId);
    const count = await model.count({
      where: { id } as Record<string, unknown> as WhereOptions,
    });
    return count > 0;
  }
}
