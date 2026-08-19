import { Router, Response } from 'express';
import { User } from '../models/User';
import { AuthRequest, authMiddleware } from '../middleware/auth';

export const userRoutes = Router();

// Get all users (except current)
userRoutes.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
userRoutes.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
userRoutes.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { username, profilePicture, status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { username, profilePicture, status },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Search users
userRoutes.get('/search/:query', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [
          { username: { $regex: req.params.query, $options: 'i' } },
          { email: { $regex: req.params.query, $options: 'i' } },
        ]},
      ],
    }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});
