import express, { RequestHandler } from 'express';
import request from 'supertest';
import { loginSchema } from './dto';
import { AuthController } from './controller';
import { HttpStatus } from '../../../types/enums';
import Admin from '../../../models/admin.model';
import { TestFactory } from '../../../tests/factory';
import { validate } from '../../../middleware/validate.middleware';
import { errorHandler } from '../../../middleware/error.middleware';
import { ApiResponse } from '../../../types';
import { RoleName } from '../../../constants/roles';

jest.mock('../../../utils/jwt', () => ({
  signToken: jest.fn().mockReturnValue('mocked-token'),
}));

jest.mock('../../../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('Admin Auth Module (Integration)', () => {
  let app: express.Application;
  let testAdmin: Admin;

  beforeAll(async () => {
    // Basic sync if needed
  });

  beforeEach(async () => {
    await TestFactory.clearAll();
    testAdmin = await TestFactory.createAdmin({
      email: 'admin@example.com',
      password: 'password123',
      role: RoleName.SUPER_ADMIN,
    });

    app = express();
    app.use(express.json());
    const authController = new AuthController();

    app.post(
      '/login',
      validate({ body: loginSchema.shape.body }) as RequestHandler,
      authController.login as unknown as RequestHandler
    );
    app.use(errorHandler as unknown as RequestHandler);
  });

  describe('DTO (loginSchema)', () => {
    it('should validate correct login input', () => {
      const result = loginSchema.safeParse({
        body: { email: 'admin@example.com', password: 'password123' },
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        body: { email: 'invalid', password: 'password' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('AuthService & AuthController Integration', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: 'admin@example.com', password: 'password123' });

      expect(response.status).toBe(HttpStatus.OK);
      const body = response.body as ApiResponse<{ token: string; admin: { email: string } }>;
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('token', 'mocked-token');
      expect(body.data.admin.email).toBe('admin@example.com');
    });

    it('should throw 401 when admin is not found', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: 'wrong@example.com', password: 'password123' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      const body = response.body as ApiResponse;
      expect(body.success).toBe(false);
      expect(body.code).toBe('UNAUTHORIZED');
    });

    it('should throw 401 when password does not match', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: 'admin@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      const body = response.body as ApiResponse;
      expect(body.success).toBe(false);
    });

    it('should throw 401 when admin is inactive', async () => {
      await testAdmin.update({ isActive: false });

      const response = await request(app)
        .post('/login')
        .send({ email: 'admin@example.com', password: 'password123' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      const body = response.body as ApiResponse;
      expect(body.success).toBe(false);
    });

    it('should prevent XSS attacks in email field via input sanitization', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: 'admin<script>alert(1)</script>@example.com', password: 'password123' });

      expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      const body = response.body as ApiResponse;
      expect(body.success).toBe(false);
    });
  });
});
