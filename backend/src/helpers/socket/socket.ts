import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import config from '../../config/config.js';
import type { SocketEvent } from '../../constants/index.js';

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
    },
  });

  io.on('connection', socket => {
    // join store
    socket.on('join-store', (storeId: string) => {
      if (!storeId) return;

      socket.join(`store:${storeId}`);
      console.log(`Socket ${socket.id} joined store:${storeId}`);
    });

    socket.on('leave-store', (storeId: string) => {
      socket.leave(`store:${storeId}`);
    });

    // join user
    socket.on('join-user', (userId: string) => {
      if (!userId) return;

      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined user:${userId}`);
    });

    socket.on('leave-user', (userId: string) => {
      socket.leave(`user:${userId}`);
    });
  });

  return io;
};

export const emitToStore = (storeId: string, event: SocketEvent) => {
  io?.to(`store:${storeId}`).emit(event);
};
export const emitToUser = (userId: string, event: SocketEvent) => {
  io?.to(`user:${userId}`).emit(event);
};
