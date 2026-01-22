import { Request, Response } from 'express';
import { HttpStatus } from '../types/enums';
import { PaginatedResult, ApiResponse } from '../types';

export abstract class BaseController {
  protected success<T>(
    req: Request,
    res: Response,
    data: T,
    message?: string,
    status: HttpStatus = HttpStatus.OK
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
      requestId: req.context?.requestId ?? 'unknown',
      timestamp: new Date().toISOString(),
    };
    return res.status(status).json(response);
  }

  protected created<T>(req: Request, res: Response, data: T, message?: string): Response {
    return this.success(req, res, data, message, HttpStatus.CREATED);
  }

  protected noContent(res: Response): Response {
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  protected paginated<T>(req: Request, res: Response, result: PaginatedResult<T>): Response {
    const response = {
      success: true,
      data: result.data,
      meta: result.meta,
      requestId: req.context?.requestId ?? 'unknown',
      timestamp: new Date().toISOString(),
    };
    return res.status(HttpStatus.OK).json(response);
  }
}
