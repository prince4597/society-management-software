import { ErrorCode, ErrorHttpStatusMap, HttpStatus } from '../types/enums';

export abstract class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: HttpStatus;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(message: string, code: ErrorCode = ErrorCode.INTERNAL_ERROR, isOperational = true) {
    super(message);
    this.code = code;
    this.statusCode = ErrorHttpStatusMap[code];
    this.isOperational = isOperational;
    this.timestamp = new Date();

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(message = 'Validation failed', errors: Record<string, string[]> = {}) {
    super(message, ErrorCode.VALIDATION_ERROR);
    this.errors = errors;
  }

  public override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', id?: number | string) {
    const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
    super(message, ErrorCode.NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, ErrorCode.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, ErrorCode.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, ErrorCode.CONFLICT);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Invalid request') {
    super(message, ErrorCode.BAD_REQUEST);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, ErrorCode.DATABASE_ERROR, false);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, ErrorCode.SERVICE_UNAVAILABLE);
  }
}
