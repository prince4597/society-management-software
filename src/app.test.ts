import request from 'supertest';
import { app } from './app';
import { HttpStatus } from './types/enums';
import { ApiResponse } from './types';

describe('Global App Integration', () => {
  describe('GET / (Root Path)', () => {
    it('should return 200 with standard success response and API info', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(HttpStatus.OK);
      const body = response.body as ApiResponse<any>;
      expect(body).toMatchObject({
        success: true,
        data: {
          name: 'SaaS API',
          version: '1.0.0',
          status: 'operational',
          docs: '/docs',
        },
      });
      expect(body.requestId).toBeDefined();
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('404 Not Found Handling', () => {
    it('should return 404 with standard JSON for non-existent routes', async () => {
      const response = await request(app).get('/api/v1/unknown-route-totally-not-real');
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      const body = response.body as ApiResponse<any>;
      expect(body).toMatchObject({
        success: false,
        code: 'NOT_FOUND',
      });
      expect(body.message).toContain('not found');
      expect(body.requestId).toBeDefined();
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('Security & Sanitization', () => {
    it('should include standard security headers', async () => {
      const response = await request(app).get('/');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('should sanitize potentially malicious input in root-safe endpoints if applicable', async () => {
      const response = await request(app)
        .post('/api/v1/admin/auth/login')
        .send({ email: 'test<script>alert(1)</script>@example.com', password: 'pwd' });

      expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('Rate Limiting', () => {
    it('should include rate limit headers', async () => {
      const response = await request(app).get('/');

      const limitHeader =
        response.headers['ratelimit-limit'] || response.headers['x-ratelimit-limit'];
      const remainingHeader =
        response.headers['ratelimit-remaining'] || response.headers['x-ratelimit-remaining'];

      expect(limitHeader).toBeDefined();
      expect(remainingHeader).toBeDefined();
    });
  });
});
