import User from '../models/User.js';

// Reusable helper to get user by ID
export const getUserById = async (userId) => {
  try {
    return await User.findById(userId).select('-passwordHash');
  } catch (err) {
    throw new Error('Failed to fetch user');
  }
};
