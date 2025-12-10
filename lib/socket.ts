import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HTTPServer) => {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle selecting an employee for camera stream
      socket.on('select-employee', (employeeId: string) => {
        console.log('Employee selected:', employeeId);
        io?.emit('employee-selected', employeeId);
      });

      // Handle WebRTC signaling
      socket.on('offer', (data: { offer: RTCSessionDescriptionInit, to: string }) => {
        socket.to(data.to).emit('offer', { offer: data.offer, from: socket.id });
      });

      socket.on('answer', (data: { answer: RTCSessionDescriptionInit, to: string }) => {
        socket.to(data.to).emit('answer', { answer: data.answer, from: socket.id });
      });

      socket.on('ice-candidate', (data: { candidate: RTCIceCandidateInit, to: string }) => {
        socket.to(data.to).emit('ice-candidate', { candidate: data.candidate, from: socket.id });
      });

      // Notify when camera stream starts
      socket.on('stream-started', () => {
        socket.broadcast.emit('stream-available');
      });

      // Handle picture capture
      socket.on('capture-picture', (data: { employeeId: string }) => {
        socket.broadcast.emit('capture-request', data.employeeId);
      });

      socket.on('picture-captured', (data: { imageData: string, employeeId: string }) => {
        io?.emit('picture-saved', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        socket.broadcast.emit('stream-ended');
      });
    });
  }

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
