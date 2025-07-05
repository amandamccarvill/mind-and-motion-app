import Yoga from '../models/yogaPoses.js';

// Helper function for internal use (e.g., dashboard)
export const fetchYogaPoses = async () => {
  try {
    const yogaPoses = await Yoga.find();
    return yogaPoses;
  } catch (err) {
    throw new Error('Failed to fetch yoga poses');
  }
};

// Express route handler for GET /api/yoga
export const getYogaPoses = async (req, res) => {
    try {
      const yogaPoses = await fetchYogaPoses();  // Returns array
      if (!yogaPoses || yogaPoses.length === 0) {
        return res.status(404).json({ error: 'Yoga poses not found' });
      }
      res.status(200).json(yogaPoses);  // Sends array of poses to client
    } catch (err) {
      res.status(500).json({ error: 'Get all yoga poses Server error' });
    }
  };