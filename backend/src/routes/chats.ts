import { Router, Response } from 'express';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export const chatRoutes = Router();

// Get all chats for current user
chatRoutes.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const chats = await Chat.find({ participants: req.userId })
      .populate('participants', '-password')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Create or get private chat
chatRoutes.post('/private/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const otherUserId = req.params.userId;
    
    let chat = await Chat.findOne({
      type: 'private',
      participants: { $all: [req.userId, otherUserId] },
    }).populate('participants', '-password');

    if (!chat) {
      chat = new Chat({
        name: `Chat-${uuidv4()}`,
        type: 'private',
        participants: [req.userId, otherUserId],
        createdBy: req.userId,
      });
      await chat.save();
      await chat.populate('participants', '-password');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create/get chat' });
  }
});

// Create group chat
chatRoutes.post('/group', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, participants } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const chat = new Chat({
      name,
      description,
      type: 'group',
      participants: [...participants, req.userId],
      createdBy: req.userId,
    });

    await chat.save();
    await chat.populate('participants', '-password');
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Get chat details
chatRoutes.get('/:chatId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', '-password')
      .populate('lastMessage');
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});
