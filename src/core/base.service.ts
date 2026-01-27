import { IService, IRepository, ServiceResponse, FindOptions, PaginatedResult } from '../types';
import { NotFoundError } from '../middleware/errors';
import { logger } from '../utils/logger';

export abstract class BaseService<
  T,
  CreateDTO,
  UpdateDTO,
  ID = string | number,
> implements IService<T, CreateDTO, UpdateDTO, ID> {
  protected readonly repository: IRepository<T, CreateDTO, UpdateDTO, ID>;
  protected readonly entityName: string;

  constructor(repository: IRepository<T, CreateDTO, UpdateDTO, ID>, entityName: string) {
    this.repository = repository;
    this.entityName = entityName;
  }

  protected success<R>(data: R, message?: string): ServiceResponse<R> {
    return { success: true, data, message };
  }

  protected failure(message: string, code?: string): ServiceResponse<never> {
    return { success: false, message, code };
  }

  async findById(id: ID, societyId?: string): Promise<ServiceResponse<T>> {
    const entity = await this.repository.findById(id, societyId);
    if (!entity) {
      throw new NotFoundError(this.entityName, id as unknown as string | number);
    }
    return this.success(entity);
  }

  async findAll(options?: FindOptions<T>): Promise<ServiceResponse<T[]>> {
    const entities = await this.repository.findAll(options);
    return this.success(entities);
  }

  async findAllPaginated(options: FindOptions<T>): Promise<ServiceResponse<PaginatedResult<T>>> {
    const result = await this.repository.findAllPaginated(options);
    return this.success(result);
  }

  async create(data: CreateDTO, societyId?: string): Promise<ServiceResponse<T>> {
    const createData = societyId ? ({ ...data, societyId } as CreateDTO & { societyId?: string }) : data;
    const entity = await this.repository.create(createData as CreateDTO);
    logger.info(`${this.entityName} created successfully`);
    return this.success(entity, `${this.entityName} created successfully`);
  }

  async update(id: ID, data: UpdateDTO, societyId?: string): Promise<ServiceResponse<T>> {
    const entity = await this.repository.update(id, data, societyId);
    if (!entity) {
      throw new NotFoundError(this.entityName, id as unknown as string | number);
    }
    logger.info(`${this.entityName} ${id as unknown as string} updated successfully`);
    return this.success(entity, `${this.entityName} updated successfully`);
  }

  async delete(id: ID, societyId?: string): Promise<ServiceResponse<boolean>> {
    const deleted = await this.repository.delete(id, societyId);
    if (!deleted) {
      throw new NotFoundError(this.entityName, id as unknown as string | number);
    }
    logger.info(`${this.entityName} ${id as unknown as string} deleted successfully`);
    return this.success(true, `${this.entityName} deleted successfully`);
  }
}
