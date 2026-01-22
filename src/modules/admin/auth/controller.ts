import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../core/base.controller';
import { AuthService } from './service';
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
      this.success(req, res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };
}
