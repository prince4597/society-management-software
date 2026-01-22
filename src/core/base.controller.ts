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

  protected setCookie(
    res: Response,
    name: string,
    value: string,
    options: any = {}
  ): void {
    res.cookie(name, value, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // Default 7 days
      ...options,
    });
  }

  protected clearCookie(res: Response, name: string): void {
    res.clearCookie(name, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
    });
  }
}
