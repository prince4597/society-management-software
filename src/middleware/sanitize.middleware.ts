import { Request, Response, NextFunction } from 'express';
import { sanitizeObject } from '../utils/security';

export const sanitize = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body as Record<string, unknown>);
  }

  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        sanitizedQuery[key] = sanitizeObject({ value }).value;
      } else {
        sanitizedQuery[key] = value;
      }
    }
    req.query = sanitizedQuery as typeof req.query;
  }

  if (req.params && typeof req.params === 'object') {
    const sanitizedParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.params)) {
      sanitizedParams[key] = sanitizeObject({ value }).value;
    }
    req.params = sanitizedParams;
  }

  next();
};
