import winston from 'winston';
import path from 'path';
import fs from 'fs';

const LOG_DIR = 'logs';

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const formatMeta = (meta: Record<string, unknown>): string => {
  const filtered = Object.entries(meta).filter(
    ([key]) => !['level', 'message', 'timestamp', 'stack'].includes(key)
  );
  return filtered.length > 0 ? ` ${JSON.stringify(Object.fromEntries(filtered))}` : '';
};

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack, ...meta } = info;
    const metaStr = formatMeta(meta);
    const ts = String(timestamp);
    const msg = String(message);
    const lvl = level.toUpperCase().padEnd(5);
    const baseLog = `${ts} [${lvl}] ${msg}${metaStr}`;
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
    const { timestamp, level, message, stack } = info;
    const ts = String(timestamp);
    const msg = String(message);
    const baseLog = `${ts} ${level} ${msg}`;
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
