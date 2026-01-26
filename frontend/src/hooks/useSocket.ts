'use client';

import { useCallback } from 'react';
import { useSocketContext } from '@/providers/SocketProvider';

export const useSocket = () => {
  const { socket, isConnected, connectionError } = useSocketContext();

  const on = useCallback(
    <T = unknown>(event: string, callback: (data: T) => void) => {
      if (socket) {
        socket.on(event, callback as (data: unknown) => void);
      }
      return () => {
        if (socket) {
          socket.off(event, callback as (data: unknown) => void);
        }
      };
    },
    [socket]
  );

  const emit = useCallback(
    (event: string, data?: unknown) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  const subscribeToRoom = useCallback(
    (room: string) => {
      emit('subscribe:room', room);
    },
    [emit]
  );

  const unsubscribeFromRoom = useCallback(
    (room: string) => {
      emit('unsubscribe:room', room);
    },
    [emit]
  );

  return {
    isConnected,
    connectionError,
    on,
    emit,
    socket,
    subscribeToRoom,
    unsubscribeFromRoom,
  };
};
