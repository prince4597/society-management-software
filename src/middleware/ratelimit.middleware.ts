import rateLimit from 'express-rate-limit';
import { HttpStatus } from '../types/enums';
import { env } from '../config/environment';

const createRateLimiter = (
  windowMs: number,
  max: number,
  message: string
): ReturnType<typeof rateLimit> => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      code: 'RATE_LIMITED',
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip ?? req.socket.remoteAddress ?? 'unknown',
    handler: (_req, res) => {
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        success: false,
        code: 'RATE_LIMITED',
        message,
        timestamp: new Date().toISOString(),
      });
    },
  });
};

export const globalRateLimiter = createRateLimiter(
  env.RATE_LIMIT_WINDOW_MS,
  env.RATE_LIMIT_MAX,
  'Too many requests, please try again later'
);

export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000,
  5,
  'Too many authentication attempts, please try again after 15 minutes'
);

export const strictRateLimiter = createRateLimiter(
  60 * 1000,
  10,
  'Too many requests, please slow down'
);

export const apiRateLimiter = createRateLimiter(
  60 * 1000,
  60,
  'API rate limit exceeded, please try again later'
);
