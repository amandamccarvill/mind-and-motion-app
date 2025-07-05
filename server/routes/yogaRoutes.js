import { getYogaPoses } from '../controllers/yogaPoses.js';
import express from 'express';

const router = express.Router();
router.get('/', getYogaPoses);
export default router;