import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { RequestContext } from '../types';

export const requestContext = (req: Request, _res: Response, next: NextFunction): void => {
  const context: RequestContext = {
    requestId: (req.headers['x-request-id'] as string) ?? randomUUID(),
    timestamp: new Date(),
    ip: req.ip ?? req.socket.remoteAddress ?? 'unknown',
    userAgent: req.headers['user-agent'] ?? 'unknown',
  };

  req.context = context;
  next();
};
