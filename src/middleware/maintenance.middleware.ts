import { Request, Response, NextFunction } from 'express';
import { systemConfigService } from '../modules/system-config/service';
import { logger } from '../utils/logger';

/**
 * Middleware to check if the system is in maintenance mode.
 * Admins are allowed to bypass this.
 */
export const maintenanceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isMaintenance = await systemConfigService.isMaintenanceMode();

    if (isMaintenance) {
      // Use standard Express Request 'user' field
      const isAdmin = req.user?.role === 'SUPER_ADMIN';

      if (!isAdmin) {
        res.status(503).json({
          success: false,
          message: 'System is currently under maintenance. Please try again later.',
          code: 'MAINTENANCE_MODE',
          requestId: req.context?.requestId ?? 'unknown',
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    next();
  } catch (error) {
    logger.error('Maintenance middleware error:', error);
    next(); // Fail open to avoid blocking everything if config fails
  }
};
