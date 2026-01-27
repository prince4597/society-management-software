import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { env } from './config/environment';
import {
  errorHandler,
  notFoundHandler,
  requestContext,
  sanitize,
  securityHeaders,
  apiRateLimiter,
} from './middleware';
import { metricsRegistry, metricsMiddleware } from './utils/metrics';
import routes from './routes';
import { logger } from './utils/logger';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger';

export const createApp = (): Application => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(securityHeaders);
  app.use(cookieParser());
  app.use(compression());

  const corsOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());

  app.use(
    cors({
      origin: env.NODE_ENV === 'production'
        ? corsOrigins
        : true, // true allows reflections, useful for dev/preview
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
      exposedHeaders: [
        'X-Request-ID',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'RateLimit-Limit',
        'RateLimit-Remaining',
        'RateLimit-Reset',
      ],
      credentials: true,
      maxAge: 86400,
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.use(hpp());
  app.use(requestContext);
  app.use(sanitize);
  app.use(metricsMiddleware);
  app.use(apiRateLimiter);

  if (env.NODE_ENV === 'development') {
    app.use((req, _res, next) => {
      logger.debug(`${req.method} ${req.path}`, {
        requestId: req.context.requestId,
      });
      next();
    });
  }

  app.get('/metrics', async (_req: Request, res: Response) => {
    res.set('Content-Type', metricsRegistry.contentType);
    res.end(await metricsRegistry.metrics());
  });

  app.get('/', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        name: 'SaaS API',
        version: '1.0.0',
        status: 'operational',
        docs: '/docs',
        endpoints: {
          health: '/api/v1/health',
          adminAuth: '/api/v1/admin/auth',
        },
      },
      requestId: req.context.requestId,
      timestamp: req.context.timestamp.toISOString(),
    });
  });

  const specs = swaggerJsdoc(swaggerOptions);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.use('/api/v1', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
