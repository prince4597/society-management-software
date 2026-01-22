import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger';
import { env } from '../config/environment';

interface SocketAuth {
  role?: string;
  userId?: string;
  societyId?: string;
}

interface ServerToClientEvents {
  'health:update': (data: unknown) => void;
  'system:stats:update': (data: unknown) => void;
  'system:notification': (data: SystemNotificationPayload) => void;
  error: (data: { message: string; code: string }) => void;
}

interface ClientToServerEvents {
  'subscribe:room': (room: string) => void;
  'unsubscribe:room': (room: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId?: string;
  role?: string;
  societyId?: string;
  connectedAt: Date;
}

interface SystemNotificationPayload {
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
type TypedSocketServer = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

class SocketManager {
  private static instance: SocketManager;
  private io: TypedSocketServer | null = null;
  private onAdminConnectCallback: (() => void) | null = null;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  initialize(server: HttpServer): TypedSocketServer {
    if (this.io) {
      logger.warn('Socket.IO already initialized, returning existing instance');
      return this.io;
    }

    this.io = new SocketIOServer<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(server, {
      cors: {
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
    });

    this.setupMiddleware();
    this.setupEventHandlers();

    logger.info('Socket.IO initialized successfully');
    return this.io;
  }

  private setupMiddleware(): void {
    if (!this.io) return;

    this.io.use((socket: TypedSocket, next) => {
      const auth = socket.handshake.auth as SocketAuth;

      socket.data.connectedAt = new Date();
      socket.data.userId = auth.userId;
      socket.data.role = auth.role;
      socket.data.societyId = auth.societyId;

      next();
    });
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: TypedSocket) => {
      const { role, userId } = socket.data;
      const isAdmin = role === 'SUPER_ADMIN';

      if (isAdmin) {
        void socket.join('admin:health');
        logger.info(`Admin connected to health monitoring`, { socketId: socket.id, userId });

        if (this.onAdminConnectCallback) {
          this.onAdminConnectCallback();
        }
      }

      socket.on('subscribe:room', (room: string) => {
        if (this.isValidRoom(room, socket.data)) {
          void socket.join(room);
          logger.debug(`Socket joined room`, { socketId: socket.id, room });
        }
      });

      socket.on('unsubscribe:room', (room: string) => {
        void socket.leave(room);
        logger.debug(`Socket left room`, { socketId: socket.id, room });
      });

      socket.on('disconnect', (reason) => {
        logger.debug(`Socket disconnected`, { socketId: socket.id, reason });
      });

      socket.on('error', (error) => {
        logger.error(`Socket error`, { socketId: socket.id, error: error.message });
      });
    });
  }

  private isValidRoom(room: string, data: SocketData): boolean {
    if (room.startsWith('admin:') && data.role !== 'SUPER_ADMIN') {
      return false;
    }

    if (room.startsWith('society:') && data.societyId) {
      const roomSocietyId = room.split(':')[1];
      return roomSocietyId === data.societyId || data.role === 'SUPER_ADMIN';
    }

    return true;
  }

  getServer(): TypedSocketServer {
    if (!this.io) {
      throw new Error('Socket.IO not initialized. Call initialize() first.');
    }
    return this.io;
  }

  broadcastToAdmins(event: keyof ServerToClientEvents, data: unknown): void {
    if (this.io) {
      this.io.to('admin:health').emit(event, data);
    }
  }

  broadcastToSociety(societyId: string, event: keyof ServerToClientEvents, data: unknown): void {
    if (this.io) {
      this.io.to(`society:${societyId}`).emit(event, data);
    }
  }

  async shutdown(): Promise<void> {
    if (!this.io) return;

    return new Promise((resolve) => {
      void this.io!.close((err) => {
        if (err) {
          if (err.message === 'Server is not running') {
            logger.debug('Socket.IO server already closed');
          } else {
            logger.error('Error closing Socket.IO server', { error: err.message });
          }
        } else {
          logger.info('Socket.IO server closed');
        }
        this.io = null;
        resolve();
      });
    });
  }

  getConnectionCount(): number {
    return this.io?.engine?.clientsCount ?? 0;
  }

  setOnAdminConnect(callback: () => void): void {
    this.onAdminConnectCallback = callback;
  }

  getAdminRoomSize(): number {
    if (!this.io) return 0;
    const room = this.io.sockets.adapter.rooms.get('admin:health');
    return room?.size ?? 0;
  }
}

const socketManager = SocketManager.getInstance();

export const initSocket = (server: HttpServer): TypedSocketServer => {
  return socketManager.initialize(server);
};

export const getIO = (): TypedSocketServer => {
  return socketManager.getServer();
};

export const broadcastToAdmins = (event: keyof ServerToClientEvents, data: unknown): void => {
  socketManager.broadcastToAdmins(event, data);
};

export const shutdownSocket = (): Promise<void> => {
  return socketManager.shutdown();
};

export {
  socketManager,
  TypedSocket,
  TypedSocketServer,
  ServerToClientEvents,
  ClientToServerEvents,
};
