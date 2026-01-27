import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { RequestContext } from '../types';
import { loggerContext } from '../utils/logger';

export const requestContext = (req: Request, _res: Response, next: NextFunction): void => {
  const requestId = (req.headers['x-request-id'] as string) ?? randomUUID();

  const context: RequestContext = {
    requestId,
    timestamp: new Date(),
    ip: req.ip ?? req.socket.remoteAddress ?? 'unknown',
    userAgent: req.headers['user-agent'] ?? 'unknown',
  };

  req.context = context;

  // Track request in AsyncLocalStorage for transparent logging
  const store = new Map<string, string>();
  store.set('requestId', requestId);

  loggerContext.run(store, () => {
    next();
  });
};
