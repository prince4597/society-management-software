import { Request, Response, NextFunction, RequestHandler } from 'express';

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
  requestId: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  requestId: string;
  timestamp: string;
  errors?: Record<string, string[]>;
  stack?: string;
}

export interface FindOptions<T = unknown> {
  where?: Partial<T>;
  pagination?: PaginationParams;
  include?: string[];
}

export interface IRepository<T, CreateDTO, UpdateDTO> {
  findById(id: number): Promise<T | null>;
  findOne(options: FindOptions<T>): Promise<T | null>;
  findAll(options?: FindOptions<T>): Promise<T[]>;
  findAllPaginated(options: FindOptions<T>): Promise<PaginatedResult<T>>;
  create(data: CreateDTO): Promise<T>;
  update(id: number, data: UpdateDTO): Promise<T | null>;
  delete(id: number): Promise<boolean>;
  count(where?: Partial<T>): Promise<number>;
}

export interface IService<T, CreateDTO, UpdateDTO> {
  findById(id: number): Promise<ServiceResponse<T>>;
  findAll(options?: FindOptions<T>): Promise<ServiceResponse<T[]>>;
  findAllPaginated(options: FindOptions<T>): Promise<ServiceResponse<PaginatedResult<T>>>;
  create(data: CreateDTO): Promise<ServiceResponse<T>>;
  update(id: number, data: UpdateDTO): Promise<ServiceResponse<T>>;
  delete(id: number): Promise<ServiceResponse<boolean>>;
}

export interface RequestContext {
  requestId: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  userId?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      context: RequestContext;
      user?: {
        id: string;
        role: string;
        societyId?: string;
      };
    }
  }
}

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const DEFAULT_PAGINATION: PaginationParams = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'DESC',
};

export const calculatePaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export * from './shared';
