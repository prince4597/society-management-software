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

  constructor(model: ModelStatic<T>, entityName: string) {
    this.model = model;
    this.entityName = entityName;
  }

  public getModel(): ModelStatic<T> {
    return this.model;
  }

  protected buildWhereClause(where?: Partial<Attributes> | Record<string, unknown>, societyId?: string): WhereOptions {
    const whereClause: Record<string, unknown> = (where ?? {}) as Record<string, unknown>;
    if (societyId) {
      whereClause['societyId'] = societyId;
    }
    return whereClause as WhereOptions;
  }

  protected buildOrderClause(pagination?: PaginationParams): Order {
    const { sortBy, sortOrder } = pagination ?? DEFAULT_PAGINATION;
    return [[sortBy, sortOrder]];
  }

  protected buildFindOptions(options?: FindOptions<Attributes>): SequelizeFindOptions {
    const findOptions: SequelizeFindOptions = {};

    if (options?.where || options?.societyId) {
      findOptions.where = this.buildWhereClause(options.where, options.societyId) as WhereOptions;
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
      const where: Record<string, unknown> = { id };
      if (societyId) where['societyId'] = societyId;

      const record = await this.model.findOne({ where: where as WhereOptions });
      return record ? (record.toJSON() as Attributes) : null;
    } catch (error) {
      logger.error(`${this.entityName}.findById failed:`, error);
      throw new DatabaseError(`Failed to find ${this.entityName}`);
    }
  }

  async findOne(options: FindOptions<Attributes>): Promise<Attributes | null> {
    try {
      const record = await this.model.findOne(this.buildFindOptions(options));
      return record ? (record.toJSON() as Attributes) : null;
    } catch (error) {
      logger.error(`${this.entityName}.findOne failed:`, error);
      throw new DatabaseError(`Failed to find ${this.entityName}`);
    }
  }

  async findAll(options?: FindOptions<Attributes>): Promise<Attributes[]> {
    try {
      const records = await this.model.findAll(this.buildFindOptions(options));
      return records.map((record) => record.toJSON() as Attributes);
    } catch (error) {
      logger.error(`${this.entityName}.findAll failed:`, error);
      throw new DatabaseError(`Failed to fetch ${this.entityName} list`);
    }
  }

  async findAllPaginated(options: FindOptions<Attributes>): Promise<PaginatedResult<Attributes>> {
    try {
      const pagination = options.pagination ?? DEFAULT_PAGINATION;
      const { count, rows } = await this.model.findAndCountAll(this.buildFindOptions(options));

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
      const where: Record<string, unknown> = { id };
      if (societyId) where['societyId'] = societyId;

      const [affectedCount] = await this.model.update(
        data as unknown as Partial<T['_attributes']>,
        { where: where as WhereOptions }
      );

      if (affectedCount === 0) {
        return null;
      }

      return this.findById(id, societyId);
    } catch (error) {
      logger.error(`${this.entityName}.update failed:`, error);
      throw new DatabaseError(`Failed to update ${this.entityName}`);
    }
  }

  async delete(id: ID, societyId?: string): Promise<boolean> {
    try {
      const where: Record<string, unknown> = { id };
      if (societyId) where['societyId'] = societyId;

      const affectedCount = await this.model.destroy({ where: where as WhereOptions });
      return affectedCount > 0;
    } catch (error) {
      logger.error(`${this.entityName}.delete failed:`, error);
      throw new DatabaseError(`Failed to delete ${this.entityName}`);
    }
  }

  async count(where?: Partial<Attributes> | Record<string, unknown>, societyId?: string): Promise<number> {
    try {
      return await this.model.count({
        where: this.buildWhereClause(where, societyId),
      });
    } catch (error) {
      logger.error(`${this.entityName}.count failed:`, error);
      throw new DatabaseError(`Failed to count ${this.entityName}`);
    }
  }

  async exists(id: ID): Promise<boolean> {
    const count = await this.model.count({
      where: { id } as Record<string, unknown> as WhereOptions,
    });
    return count > 0;
  }
}
