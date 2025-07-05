import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middlewares/verifyToken.js';

// import { verify } from 'jsonwebtoken';

const router = express.Router();

// Helper function to get the user by ID
const getUserById = async (userId) => {
    try {
      return await User.findById(userId).select('-passwordHash');
    } catch (err) {
      throw new Error('Failed to fetch user');
    }
  };
  
  // GET /api/user/profile - Get logged-in user info
  router.get('/profile', verifyToken, async (req, res) => {
    try {
      const user = await getUserById(req.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'profile Server error' });
    }
  });
  
  // PUT /api/user/profile - Update logged-in user info
  router.put('/profile', verifyToken, async (req, res) => {
    try {
      const updates = req.body;
      const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-passwordHash');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'update profile Server error' });
    }
  });

export default router;
