console.log('Server starting...');

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet'; 
import rateLimit from 'express-rate-limit'; 
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardroutes from './routes/dashboardRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import yogaRoutes from './routes/yogaRoutes.js';
import meditationRoutes from './routes/meditationSoundsRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import { verifyToken } from './middlewares/verifyToken.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config({ path: '.env' });

const app = express();
connectDB();

// Security middlewares
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
}));

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:5173', 'https://mind-and-motion-app.vercel.app'];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200

}
// Core middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl} - Headers:`, req.headers);

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    console.log(`[RESPONSE] Status: ${res.statusCode} - Body:`, body);
    return originalJson(body);
  };

  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardroutes);
app.use('/api', apiRoutes);
app.use ('/api/yoga', yogaRoutes);
app.use ('/api/meditation', meditationRoutes);
app.use ('/api/favorites', favoriteRoutes);

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Welcome, authenticated user!', userId: req.userId });
});

// Root ping
app.get('/', (req, res) => res.send('Mind & Motion API is running'));

// Global error handler
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
