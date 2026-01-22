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
> implements IRepository<Attributes, CreateDTO, UpdateDTO> {
  protected readonly model: ModelStatic<T>;
  protected readonly entityName: string;

  constructor(model: ModelStatic<T>, entityName: string) {
    this.model = model;
    this.entityName = entityName;
  }

  protected buildWhereClause(where?: Partial<Attributes>): WhereOptions {
    return (where ?? {}) as WhereOptions;
  }

  protected buildOrderClause(pagination?: PaginationParams): Order {
    const { sortBy, sortOrder } = pagination ?? DEFAULT_PAGINATION;
    return [[sortBy, sortOrder]];
  }

  protected buildFindOptions(options?: FindOptions<Attributes>): SequelizeFindOptions {
    const findOptions: SequelizeFindOptions = {};

    if (options?.where) {
      findOptions.where = this.buildWhereClause(options.where);
    }

    if (options?.pagination) {
      const { page, limit } = options.pagination;
      findOptions.offset = (page - 1) * limit;
      findOptions.limit = limit;
      findOptions.order = this.buildOrderClause(options.pagination);
    }

    return findOptions;
  }

  async findById(id: number): Promise<Attributes | null> {
    try {
      const record = await this.model.findByPk(id);
      return record ? record.toJSON() : null;
    } catch (error) {
      logger.error(`${this.entityName}.findById failed:`, error);
      throw new DatabaseError(`Failed to find ${this.entityName}`);
    }
  }

  async findOne(options: FindOptions<Attributes>): Promise<Attributes | null> {
    try {
      const record = await this.model.findOne(this.buildFindOptions(options));
      return record ? record.toJSON() : null;
    } catch (error) {
      logger.error(`${this.entityName}.findOne failed:`, error);
      throw new DatabaseError(`Failed to find ${this.entityName}`);
    }
  }

  async findAll(options?: FindOptions<Attributes>): Promise<Attributes[]> {
    try {
      const records = await this.model.findAll(this.buildFindOptions(options));
      return records.map((record) => record.toJSON());
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
        data: rows.map((record) => record.toJSON()),
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
      return record.toJSON();
    } catch (error) {
      logger.error(`${this.entityName}.create failed:`, error);
      throw new DatabaseError(`Failed to create ${this.entityName}`);
    }
  }

  async update(id: number, data: UpdateDTO): Promise<Attributes | null> {
    try {
      const [affectedCount] = await this.model.update(
        data as unknown as Partial<T['_attributes']>,
        { where: { id } as unknown as WhereOptions }
      );

      if (affectedCount === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      logger.error(`${this.entityName}.update failed:`, error);
      throw new DatabaseError(`Failed to update ${this.entityName}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const affectedCount = await this.model.destroy({
        where: { id } as unknown as WhereOptions,
      });
      return affectedCount > 0;
    } catch (error) {
      logger.error(`${this.entityName}.delete failed:`, error);
      throw new DatabaseError(`Failed to delete ${this.entityName}`);
    }
  }

  async count(where?: Partial<Attributes>): Promise<number> {
    try {
      return await this.model.count({
        where: this.buildWhereClause(where),
      });
    } catch (error) {
      logger.error(`${this.entityName}.count failed:`, error);
      throw new DatabaseError(`Failed to count ${this.entityName}`);
    }
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.model.count({
      where: { id } as unknown as WhereOptions,
    });
    return count > 0;
  }
}
