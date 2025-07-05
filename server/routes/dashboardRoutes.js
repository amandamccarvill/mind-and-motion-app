import axios from 'axios'; 
import { fetchYogaPoses } from '../controllers/yogaPoses.js';
import MeditationSounds from '../models/meditationSounds.js';
import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { getUserById } from '../controllers/userController.js';

const router = express.Router();

// Dashboard Route - Get user dashboard with all relevant data
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch daily affirmation
    const affirmationResponse = await axios.get('https://www.affirmations.dev/');
    const affirmation = affirmationResponse?.data?.affirmation;
    if (!affirmation) return res.status(500).json({ error: 'Failed to fetch affirmation' });

    // Fetch daily horoscope
    let horoscope = null;
    try {
      const zodiac = user.zodiacSign?.toLowerCase() || 'virgo'; // fallback

      const horoscopeResponse = await axios.get(
        'https://astropredict-daily-horoscopes-lucky-insights.p.rapidapi.com/horoscope',
        {
          params: {
            zodiac: zodiac,
            day: 'today',
          },
          headers: {
            'X-RapidAPI-Key': 'f1a9d57f98msh8b94f4dd766f77cp11a46ejsn620e9d11f835',
            'X-RapidAPI-Host': 'astropredict-daily-horoscopes-lucky-insights.p.rapidapi.com',
          },
        }
      );

      horoscope = horoscopeResponse.data;

      if (!horoscope) {
        console.error("Horoscope missing from response:", horoscopeResponse.data);
        return res.status(500).json({ error: 'Failed to fetch horoscope' });
      }

    } catch (err) {
      console.error('Error fetching horoscope:', err.message);
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      return res.status(500).json({ errormessage: 'Horoscope service error', error: err.message });
    }

    // Fetch yoga poses and pick one randomly
    let randomYogaPose;
    try {
      const yogaPoses = await fetchYogaPoses();
      if (!Array.isArray(yogaPoses) || yogaPoses.length === 0) {
        console.error('No yoga poses found or invalid data format.');
        return res.status(500).json({ error: 'No yoga poses found' });
      }

      randomYogaPose = yogaPoses[Math.floor(Math.random() * yogaPoses.length)];
    } catch (error) {
      console.error('Error fetching yoga poses:', error);
      return res.status(500).json({ error: 'Failed to fetch yoga poses' });
    }

    // Get a random meditation sound
    const meditationSounds = await MeditationSounds.find();
    const randomMeditationSound =
      meditationSounds.length > 0
        ? meditationSounds[Math.floor(Math.random() * meditationSounds.length)]
        : null;

    // ✅ Return clean user data + dashboard content
    res.status(200).json({
      user: {
        name: user.name,
        favorites: user.favorites,
      },
      affirmation,
      horoscope,
      yogaPose: randomYogaPose,
      meditationSound: randomMeditationSound || "No meditation sounds found",
      message: 'Welcome to your dashboard',
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Dashboard server error', error: err.message });
  }
});

export default router;

