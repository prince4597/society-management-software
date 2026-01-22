import { createServer, Server as HttpServer } from 'http';
import { app } from './app';
import { env, connectDatabase, disconnectDatabase } from './config';
import { initializeModels } from './models';
import { logger } from './utils/logger';
import { initSocket, shutdownSocket, socketManager } from './core/socket';
import { healthBroadcastService } from './modules/health/health-broadcast.service';

class Server {
  private httpServer: HttpServer | null = null;
  private isShuttingDown = false;

  async start(): Promise<void> {
    try {
      await connectDatabase();
      initializeModels();

      this.httpServer = createServer(app);
      initSocket(this.httpServer);

      this.httpServer.listen(env.PORT, () => {
        logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
        logger.info(`📊 Docs: http://localhost:${env.PORT}/docs`);
        logger.info(`🔌 WebSockets: Enabled`);
      });

      socketManager.setOnAdminConnect(() => {
        void healthBroadcastService.broadcastImmediate();
      });
      healthBroadcastService.start();

      this.setupGracefulShutdown();
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string): Promise<void> => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;

      logger.info(`${signal} received. Initiating graceful shutdown...`);

      const forceShutdownTimer = setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 30000);

      try {
        if (this.httpServer) {
          await new Promise<void>((resolve, reject) => {
            this.httpServer!.close((err) => {
              if (err) {
                logger.error('Error closing HTTP server:', err);
                reject(err);
                return;
              }
              logger.info('HTTP server closed');
              resolve();
            });
          });
        }

        await shutdownSocket();
        healthBroadcastService.stop();
        await disconnectDatabase();
        clearTimeout(forceShutdownTimer);
        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        clearTimeout(forceShutdownTimer);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      void shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Rejection:', reason);
      void shutdown('unhandledRejection');
    });
  }
}

const server = new Server();
void server.start();
