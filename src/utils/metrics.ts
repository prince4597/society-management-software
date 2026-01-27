import { Registry, collectDefaultMetrics, Counter, Histogram } from 'prom-client';
import { Request, Response, NextFunction } from 'express';

export const metricsRegistry = new Registry();

metricsRegistry.setDefaultLabels({
    app: 'saas-api',
});

collectDefaultMetrics({ register: metricsRegistry });

export const httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [metricsRegistry],
});

export const httpRequestDurationSeconds = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    registers: [metricsRegistry],
});

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const duration = process.hrtime(start);
        const durationInSeconds = duration[0] + duration[1] / 1e9;
        const route = req.route?.path || req.path;

        httpRequestsTotal.inc({
            method: req.method,
            route,
            status: res.statusCode,
        });

        httpRequestDurationSeconds.observe(
            {
                method: req.method,
                route,
                status: res.statusCode,
            },
            durationInSeconds
        );
    });

    next();
};
