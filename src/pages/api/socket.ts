// src/pages/api/socket.ts

import { NextApiRequest } from 'next';
import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
import type { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (res.socket && !(res.socket as any).server.io) {
    console.log('Initializing Socket.io');

    const httpServer: HTTPServer = (res.socket as any).server as any;
    const io = new IOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('joinRoom', (data) => {
        const { coinId } = data;
        socket.join(coinId);
        console.log(`Socket ${socket.id} joined room ${coinId}`);
      });

      socket.on('chatMessage', (data) => {
        const { coinId, message, userId } = data;
        const msg = {
          id: socket.id,
          userId,
          coinId,
          message,
          createdAt: new Date(),
        };
        io.to(coinId).emit('message', msg);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
      });
    });

    if (res.socket) {
      (res.socket as any).server.io = io;
    }
  } else {
    console.log('Socket.io already initialized');
  }
  res.end();
}
