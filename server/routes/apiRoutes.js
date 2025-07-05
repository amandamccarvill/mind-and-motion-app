import express from 'express';
import axios from 'axios';

const router = express.Router();

// 1. Daily Affirmation (affirmations.dev)
router.get('/affirmation', async (req, res) => {
  try {
    const response = await axios.get('https://www.affirmations.dev/');
    res.json({ affirmation: response.data.affirmation });
  } catch (err) {
    console.error('Affirmation API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch affirmation' });
  }
});

// 2. Horoscope (RapidAPI - astropredict-daily-horoscopes-lucky-insights)
router.get('/horoscope', async (req, res) => {
  const { sign = 'virgo', day = 'today' } = req.query;

  try {
    const response = await axios.get(
      'https://astropredict-daily-horoscopes-lucky-insights.p.rapidapi.com/horoscope',
      {
        params: { zodiac: sign.toLowerCase(), day },
        headers: {
          'X-RapidAPI-Key': 'process.env.RAPIDAPI_KEY',
          'X-RapidAPI-Host': 'astropredict-daily-horoscopes-lucky-insights.p.rapidapi.com',
        },
      }
    );

    const horoscope = response.data;
    if (!horoscope) {
      return res.status(500).json({ error: 'Horoscope data missing' });
    }

    res.json(horoscope);
  } catch (err) {
    console.error('Horoscope API error:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
    res.status(500).json({ error: 'Failed to fetch horoscope' });
  }
});

export default router;
