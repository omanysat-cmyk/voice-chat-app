import { Server as SocketIOServer, Socket } from 'socket.io';
import { Call } from '../models/Call';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

const activeUsers: Map<string, string> = new Map(); // userId -> socketId
const activeCalls: Map<string, any> = new Map(); // callId -> call data

export const initializeSocketEvents = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    logger.info(`✅ User connected: ${socket.id}`);

    // User comes online
    socket.on('user:online', (userId: string) => {
      activeUsers.set(userId, socket.id);
      io.emit('users:online', Array.from(activeUsers.keys()));
      logger.info(`👤 User ${userId} is online`);
    });

    // User goes offline
    socket.on('user:offline', (userId: string) => {
      activeUsers.delete(userId);
      io.emit('users:offline', Array.from(activeUsers.keys()));
      logger.info(`👤 User ${userId} is offline`);
    });

    // Send message
    socket.on('message:send', (data: any) => {
      const { chatId, senderId, content } = data;
      io.to(`chat:${chatId}`).emit('message:new', {
        chatId,
        senderId,
        content,
        timestamp: new Date(),
      });
      logger.info(`💬 Message sent in chat ${chatId}`);
    });

    // Join chat room
    socket.on('chat:join', (chatId: string) => {
      socket.join(`chat:${chatId}`);
      logger.info(`📍 Socket joined chat: ${chatId}`);
    });

    // Leave chat room
    socket.on('chat:leave', (chatId: string) => {
      socket.leave(`chat:${chatId}`);
      logger.info(`📍 Socket left chat: ${chatId}`);
    });

    // Initiate call
    socket.on('call:initiate', async (data: any) => {
      const { callerId, receiverId, callType = 'audio' } = data;
      const callId = uuidv4();
      const receiverSocketId = activeUsers.get(receiverId);

      if (receiverSocketId) {
        try {
          const call = new Call({
            caller: callerId,
            receiver: receiverId,
            type: callType,
            status: 'pending',
            callId,
          });
          await call.save();

          activeCalls.set(callId, {
            callId,
            callerId,
            receiverId,
            callerSocketId: socket.id,
            receiverSocketId,
            type: callType,
            startedAt: new Date(),
          });

          io.to(receiverSocketId).emit('call:incoming', {
            callId,
            callerId,
            callerSocketId: socket.id,
            callType,
          });

          logger.info(`📞 Call initiated: ${callId}`);
        } catch (error) {
          logger.error('Call initiation error:', error);
        }
      }
    });

    // Accept call
    socket.on('call:accept', async (callId: string) => {
      const call = activeCalls.get(callId);
      if (call) {
        try {
          await Call.findOneAndUpdate({ callId }, { status: 'accepted', startedAt: new Date() });
          
          io.to(call.callerSocketId).emit('call:accepted', {
            callId,
            receiverSocketId: socket.id,
          });

          logger.info(`✅ Call accepted: ${callId}`);
        } catch (error) {
          logger.error('Call accept error:', error);
        }
      }
    });

    // Reject call
    socket.on('call:reject', async (callId: string) => {
      const call = activeCalls.get(callId);
      if (call) {
        try {
          await Call.findOneAndUpdate({ callId }, { status: 'rejected' });
          activeCalls.delete(callId);
          
          io.to(call.callerSocketId).emit('call:rejected', { callId });
          logger.info(`❌ Call rejected: ${callId}`);
        } catch (error) {
          logger.error('Call reject error:', error);
        }
      }
    });

    // End call
    socket.on('call:end', async (callId: string) => {
      const call = activeCalls.get(callId);
      if (call) {
        try {
          const duration = Math.floor((Date.now() - call.startedAt) / 1000);
          await Call.findOneAndUpdate(
            { callId },
            { status: 'ended', endedAt: new Date(), duration }
          );

          activeCalls.delete(callId);
          io.to(call.callerSocketId).emit('call:ended', { callId, duration });
          io.to(call.receiverSocketId).emit('call:ended', { callId, duration });
          
          logger.info(`📞 Call ended: ${callId} (duration: ${duration}s)`);
        } catch (error) {
          logger.error('Call end error:', error);
        }
      }
    });

    // WebRTC offer
    socket.on('webrtc:offer', (data: any) => {
      const { callId, offer } = data;
      const call = activeCalls.get(callId);
      if (call && call.receiverSocketId) {
        io.to(call.receiverSocketId).emit('webrtc:offer', { callId, offer });
      }
    });

    // WebRTC answer
    socket.on('webrtc:answer', (data: any) => {
      const { callId, answer } = data;
      const call = activeCalls.get(callId);
      if (call && call.callerSocketId) {
        io.to(call.callerSocketId).emit('webrtc:answer', { callId, answer });
      }
    });

    // ICE Candidate
    socket.on('webrtc:ice-candidate', (data: any) => {
      const { callId, candidate } = data;
      const call = activeCalls.get(callId);
      if (call) {
        const targetSocketId = call.callerSocketId === socket.id ? call.receiverSocketId : call.callerSocketId;
        io.to(targetSocketId).emit('webrtc:ice-candidate', { callId, candidate });
      }
    });

    // Typing indicator
    socket.on('typing:start', (data: any) => {
      const { chatId, userId } = data;
      io.to(`chat:${chatId}`).emit('typing:indicator', { chatId, userId, isTyping: true });
    });

    socket.on('typing:stop', (data: any) => {
      const { chatId, userId } = data;
      io.to(`chat:${chatId}`).emit('typing:indicator', { chatId, userId, isTyping: false });
    });

    // Disconnect
    socket.on('disconnect', () => {
      // Clean up active calls
      for (const [callId, call] of activeCalls.entries()) {
        if (call.callerSocketId === socket.id || call.receiverSocketId === socket.id) {
          activeCalls.delete(callId);
        }
      }
      logger.info(`❌ User disconnected: ${socket.id}`);
    });
  });
};
