'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    connectionError: string | null;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    connectionError: null,
});

const SOCKET_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, status } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    useEffect(() => {
        if (status !== 'authenticated' || !user) {
            return;
        }

        const newSocket = io(SOCKET_URL, {
            auth: {
                role: user.role,
                userId: user.id,
            },
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
            withCredentials: true,
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            setConnectionError(null);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            setConnectionError(err.message);
        });

        queueMicrotask(() => {
            setSocket(newSocket);
        });

        return () => {
            newSocket.disconnect();
            setSocket(null);
            setIsConnected(false);
            setConnectionError(null);
        };
    }, [user, status]);

    return (
        <SocketContext.Provider value={{ socket, isConnected, connectionError }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => useContext(SocketContext);
