import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { AsyncLocalStorage } from 'async_hooks';

export const loggerContext = new AsyncLocalStorage<Map<string, string>>();

const LOG_DIR = 'logs';

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const SENSITIVE_FIELDS = ['password', 'email', 'phoneNumber', 'token', 'secret', 'authorization'];

const maskData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;

  const mapped = { ...data };
  for (const key of Object.keys(mapped)) {
    if (SENSITIVE_FIELDS.includes(key)) {
      mapped[key] = '***REDACTED***';
    } else if (typeof mapped[key] === 'object') {
      mapped[key] = maskData(mapped[key]);
    }
  }
  return mapped;
};

const formatMeta = (meta: Record<string, unknown>): string => {
  const filtered = Object.entries(meta).filter(
    ([key]) => !['level', 'message', 'timestamp', 'stack'].includes(key)
  );
  if (filtered.length === 0) return '';

  const masked = maskData(Object.fromEntries(filtered));
  return ` ${JSON.stringify(masked)}`;
};

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack, ...meta } = info;
    const store = loggerContext.getStore();
    const requestId = store?.get('requestId') || meta['requestId'] || 'system';

    const metaStr = formatMeta(meta);
    const ts = String(timestamp);
    const msg = String(message);
    const lvl = level.toUpperCase().padEnd(5);
    const baseLog = `${ts} [${lvl}] [${requestId}] ${msg}${metaStr}`;
    if (stack && typeof stack === 'string') {
      return `${baseLog}\n${stack}`;
    }
    return baseLog;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack, ...meta } = info;
    const store = loggerContext.getStore();
    const requestId = store?.get('requestId') || meta['requestId'] || 'system';

    const ts = String(timestamp);
    const msg = String(message);
    const baseLog = `${ts} ${level} [${requestId}] ${msg}`;
    if (stack && typeof stack === 'string') {
      return `${baseLog}\n${stack}`;
    }
    return baseLog;
  })
);

const getLogLevel = (): string => {
  const envLevel = process.env['LOG_LEVEL'];
  if (envLevel) return envLevel;
  return process.env['NODE_ENV'] === 'production' ? 'info' : 'debug';
};

export const logger = winston.createLogger({
  level: getLogLevel(),
  format: logFormat,
  defaultMeta: { service: 'saas-api' },
  transports: [
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'combined.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

if (process.env['NODE_ENV'] !== 'production') {
  logger.add(new winston.transports.Console({ format: consoleFormat }));
}

export const httpLogger = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};
