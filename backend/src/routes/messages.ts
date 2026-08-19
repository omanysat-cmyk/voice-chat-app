import { Router, Response } from 'express';
import { Message } from '../models/Message';
import { Chat } from '../models/Chat';
import { AuthRequest, authMiddleware } from '../middleware/auth';

export const messageRoutes = Router();

// Get messages for a chat
messageRoutes.get('/chat/:chatId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', '-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Message.countDocuments({ chat: req.params.chatId });

    res.json({
      messages: messages.reverse(),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
messageRoutes.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { chat, content, type = 'text', fileUrl } = req.body;

    if (!chat || !content) {
      return res.status(400).json({ error: 'Chat ID and content are required' });
    }

    const message = new Message({
      chat,
      sender: req.userId,
      content,
      type,
      fileUrl,
    });

    await message.save();
    await message.populate('sender', '-password');

    // Update chat's last message
    await Chat.findByIdAndUpdate(chat, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark message as read
messageRoutes.put('/:messageId/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { $addToSet: { readBy: req.userId } },
      { new: true }
    );
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// Delete message
messageRoutes.delete('/:messageId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Message.findByIdAndDelete(req.params.messageId);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});
