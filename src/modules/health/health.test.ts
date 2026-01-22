import express from 'express';
import request from 'supertest';
import HealthRouter from './health.routes';
import { sequelize } from '../../config/database';
import { ApiResponse } from '../../types';

describe('Health Module', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/', HealthRouter);
    jest.clearAllMocks();
  });

  describe('GET / (Health Check)', () => {
    it('should return 200 with status healthy when database is up', async () => {
      const response = await request(app).get('/');
      const body = response.body as ApiResponse<{ status: string }>;

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('healthy');
    });

    it('should return 503 with status unhealthy when database is down', async () => {
      const spy = jest
        .spyOn(sequelize, 'authenticate')
        .mockRejectedValueOnce(new Error('Connection failed'));

      const response = await request(app).get('/');
      const body = response.body as ApiResponse<{ status: string }>;

      expect(response.status).toBe(503);
      expect(body.success).toBe(false);
      expect(body.data.status).toBe('unhealthy');

      spy.mockRestore();
    });
  });

  describe('GET /live (Liveness Check)', () => {
    it('should return 200 with status alive', async () => {
      const response = await request(app).get('/live');
      const body = response.body as ApiResponse<{ status: string }>;

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('alive');
    });
  });

  describe('GET /ready (Readiness Check)', () => {
    it('should return 200 with status ready when database is up', async () => {
      const response = await request(app).get('/ready');
      const body = response.body as ApiResponse<{ status: string }>;

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('ready');
    });

    it('should return 503 with status not_ready when database is down', async () => {
      const spy = jest
        .spyOn(sequelize, 'authenticate')
        .mockRejectedValueOnce(new Error('Connection failed'));

      const response = await request(app).get('/ready');
      const body = response.body as ApiResponse<{ status: string }>;

      expect(response.status).toBe(503);
      expect(body.success).toBe(false);
      expect(body.data.status).toBe('not_ready');

      spy.mockRestore();
    });
  });
});
