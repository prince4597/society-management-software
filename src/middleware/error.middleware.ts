import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from './errors';
import { logger } from '../utils/logger';
import { HttpStatus } from '../types/enums';
import { ValidationError as SequelizeValidationError } from 'sequelize';
import { ApiErrorResponse } from '../types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const requestId = req.context?.requestId ?? 'unknown';

  logger.error({
    message: err.message,
    requestId,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const response: ApiErrorResponse = {
    success: false,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    requestId,
    timestamp: new Date().toISOString(),
  };

  if (err instanceof ValidationError) {
    response.code = err.code;
    response.message = err.message;
    response.errors = err.errors;
    if (process.env['NODE_ENV'] !== 'production') {
      response.stack = err.stack;
    }
    return res.status(err.statusCode).json(response);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    response.code = 'CONFLICT';
    response.message = 'Resource already exists';
    const errors: Record<string, string[]> = {};
    if (err instanceof SequelizeValidationError) {
      err.errors.forEach((e) => {
        if (e.path) {
          errors[e.path] = [e.message];
        }
      });
    }
    response.errors = errors;
    return res.status(HttpStatus.CONFLICT).json(response);
  }

  if (err.name === 'SequelizeValidationError') {
    response.code = 'VALIDATION_ERROR';
    response.message = 'Database validation failed';
    const errors: Record<string, string[]> = {};
    if (err instanceof SequelizeValidationError) {
      err.errors.forEach((e) => {
        if (e.path) {
          errors[e.path] = [e.message];
        }
      });
    }
    response.errors = errors;
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
  }

  if (err instanceof AppError) {
    response.code = err.code;
    response.message = err.message;
    if (process.env['NODE_ENV'] !== 'production') {
      response.stack = err.stack;
    }
    return res.status(err.statusCode).json(response);
  }

  if (process.env['NODE_ENV'] !== 'production') {
    response.message = err.message;
    response.stack = err.stack;
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
};

export const notFoundHandler = (req: Request, res: Response): Response => {
  return res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
    requestId: req.context?.requestId ?? 'unknown',
    timestamp: new Date().toISOString(),
  });
};
