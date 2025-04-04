// src/utils/socket.ts

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('/', {
      path: '/api/socket',
    });
    console.log('Socket initialized');
  }
  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};
