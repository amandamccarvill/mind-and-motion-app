import {getMeditationSounds} from '../controllers/meditationSounds.js';
import express from 'express';

const router = express.Router();

router.get('/', getMeditationSounds);

export default router;
