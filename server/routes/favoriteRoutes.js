import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// Add a favorite affirmation
router.post('/affirmations', verifyToken, async (req, res) => {
  try {
    const { affirmation } = req.body;
    if (!affirmation) return res.status(400).json({ error: 'Affirmation is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.favorites.affirmations.includes(affirmation)) {
      return res.status(400).json({ error: 'Affirmation already in favorites' });
    }

    user.favorites.affirmations.push(affirmation);
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: 'Add favorite affirmation Server error' });
  }
});

// Remove a favorite affirmation
router.delete('/affirmations', verifyToken, async (req, res) => {
  try {
    const { affirmation } = req.body;
    if (!affirmation) return res.status(400).json({ error: 'Affirmation is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.favorites.affirmations = user.favorites.affirmations.filter(a => a !== affirmation);
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: 'Remove favorite affirmation Server error' });
  }
});

// Get all favorite affirmations
router.get('/affirmations', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.favorites.affirmations);
  } catch (err) {
    res.status(500).json({ error: 'Get all favorite affirmations Server error' });
  }
});


// Add a favorite yoga pose
router.post('/yoga', verifyToken, async (req, res) => {
  try {
    const { yogaPose } = req.body;
    if (!yogaPose) return res.status(400).json({ error: 'Yoga pose is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.favorites.yoga.some(p => p.name === yogaPose.name)) {
      return res.status(400).json({ error: 'Yoga pose already in favorites' });
    }

    user.favorites.yoga.push(yogaPose);
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: 'Add favorite yoga pose Server error' });
  }
});

// Remove a favorite yoga pose
router.delete('/yoga', verifyToken, async (req, res) => {
  try {
    const { yogaPose } = req.body;
    if (!yogaPose) return res.status(400).json({ error: 'Yoga pose is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.favorites.yoga = user.favorites.yoga.filter(pose => pose.name !== yogaPose.name);
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: 'Remove favorite yoga pose Server error' });
  }
});

// Get all favorite yoga poses
router.get('/yoga', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const yogaFavorites = user.favorites.yoga.filter(p => typeof p === 'object' && p.name);

    res.json(yogaFavorites);
  } catch (err) {
    res.status(500).json({ error: 'Get all favorite yoga poses Server error' });
  }
});


// Add a favorite meditation sound
router.post('/meditations', verifyToken, async (req, res) => {
  try {
    const { meditation } = req.body;
    if (!meditation) return res.status(400).json({ error: 'Meditation sound is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.favorites.meditations.some(m => m.title === meditation.title)) {
      return res.status(400).json({ error: 'Meditation sound already in favorites' });
    }

    user.favorites.meditations.push(meditation);
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: 'Add favorite meditation sound Server error' });
  }
});

// Remove a favorite meditation sound
router.delete('/meditations', verifyToken, async (req, res) => {
  try {
    const { meditation } = req.body;
    if (!meditation) return res.status(400).json({ error: 'Meditation sound is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.favorites.meditations = user.favorites.meditations.filter(m => m.title !== meditation.title);
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: 'Remove favorite meditation sound Server error' });
  }
});

// Get all favorite meditation sounds
router.get('/meditations', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const meditationFavorites = user.favorites.meditations.filter(m => typeof m === 'object' && m.title);

    res.json(meditationFavorites);
  } catch (err) {
    res.status(500).json({ error: 'Get all favorite meditation sounds Server error' });
  }
});

export default router;

