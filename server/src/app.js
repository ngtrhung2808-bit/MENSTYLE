import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const createApp = () => {
  const app = express();

  // Security & utility middlewares
  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    const isDbConnected = (await import('mongoose')).default.connection.readyState === 1;
    res.status(200).json({
      status: 'success',
      message: 'MENSTYLE Fashion Backend & Database API is running',
      database: isDbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  });

  // Main REST API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/coupons', couponRoutes);
  app.use('/api/chat', chatRoutes);

  // 404 handler for undefined routes
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: `Tài nguyên không tồn tại: ${req.method} ${req.originalUrl}`
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
