import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../core/base.controller';
import { AuthService, AdminProfile } from './service';
import { LoginInput } from './dto';

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body as LoginInput);
      this.setCookie(res, 'token', result.token);
      this.success(req, res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminData = await this.authService.getProfile(req.user!.id);
      this.success(req, res, { admin: adminData }, 'Profile retrieved');
    } catch (error) {
      next(error);
    }
  };

  public logout = (req: Request, res: Response, next: NextFunction): void => {
    try {
      this.clearCookie(res, 'token');
      this.success(req, res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminData = await this.authService.updateProfile(
        req.user!.id,
        req.body as Partial<AdminProfile>
      );
      this.success(req, res, { admin: adminData }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  };
}
