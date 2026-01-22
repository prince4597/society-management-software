import { IService, IRepository, ServiceResponse, FindOptions, PaginatedResult } from '../types';
import { NotFoundError } from '../middleware/errors';
import { logger } from '../utils/logger';

export abstract class BaseService<T, CreateDTO, UpdateDTO> implements IService<
  T,
  CreateDTO,
  UpdateDTO
> {
  protected readonly repository: IRepository<T, CreateDTO, UpdateDTO>;
  protected readonly entityName: string;

  constructor(repository: IRepository<T, CreateDTO, UpdateDTO>, entityName: string) {
    this.repository = repository;
    this.entityName = entityName;
  }

  protected success<R>(data: R, message?: string): ServiceResponse<R> {
    return { success: true, data, message };
  }

  protected failure(message: string, code?: string): ServiceResponse<never> {
    return { success: false, message, code };
  }

  async findById(id: number): Promise<ServiceResponse<T>> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundError(this.entityName, id);
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

  async create(data: CreateDTO): Promise<ServiceResponse<T>> {
    const entity = await this.repository.create(data);
    logger.info(`${this.entityName} created successfully`);
    return this.success(entity, `${this.entityName} created successfully`);
  }

  async update(id: number, data: UpdateDTO): Promise<ServiceResponse<T>> {
    const entity = await this.repository.update(id, data);
    if (!entity) {
      throw new NotFoundError(this.entityName, id);
    }
    logger.info(`${this.entityName} ${id} updated successfully`);
    return this.success(entity, `${this.entityName} updated successfully`);
  }

  async delete(id: number): Promise<ServiceResponse<boolean>> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError(this.entityName, id);
    }
    logger.info(`${this.entityName} ${id} deleted successfully`);
    return this.success(true, `${this.entityName} deleted successfully`);
  }
}
