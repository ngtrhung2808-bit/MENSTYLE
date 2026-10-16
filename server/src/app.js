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
import { connectDB, getDatabaseState } from './config/db.js';

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

  // Root endpoint: API status & service discovery
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'MENSTYLE Fashion Backend & Database API is running',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        apiHealth: '/api/health',
        products: '/api/products',
        categories: '/api/products/categories',
        auth: '/api/auth',
        orders: '/api/orders',
        coupons: '/api/coupons',
        chat: '/api/chat'
      }
    });
  });

  // Health check handler
  const handleHealthCheck = async (req, res) => {
    let dbState = getDatabaseState();
    // Attempt auto-reconnect if database was disconnected and cooldown elapsed
    if (dbState === 'disconnected') {
      await connectDB(true);
      dbState = getDatabaseState();
    }
    const isDbConnected = dbState === 'connected';

    const responseData = {
      status: isDbConnected ? 'ok' : 'degraded',
      message: 'MENSTYLE Fashion Backend & Database API is running',
      api: 'connected',
      database: dbState,
      timestamp: new Date().toISOString()
    };

    // Return 200 when fully healthy, 503 Service Unavailable when database is not connected
    const statusCode = isDbConnected ? 200 : 503;
    return res.status(statusCode).json(responseData);
  };

  // Health check endpoints
  app.get('/health', handleHealthCheck);
  app.get('/api/health', handleHealthCheck);

  // Middleware to guard database-backed routes when database is unavailable
  const requireDatabase = async (req, res, next) => {
    let dbState = getDatabaseState();
    if (dbState === 'disconnected') {
      await connectDB(true);
      dbState = getDatabaseState();
    }
    if (dbState !== 'connected') {
      return res.status(503).json({
        success: false,
        message: 'Dịch vụ cơ sở dữ liệu MongoDB hiện không khả dụng. Vui lòng kiểm tra dịch vụ MongoDB hoặc file cấu hình .env.',
        database: dbState
      });
    }
    next();
  };


  // Main REST API routes
  app.use('/api/auth', requireDatabase, authRoutes);
  app.use('/api/products', requireDatabase, productRoutes);
  app.use('/api/orders', requireDatabase, orderRoutes);
  app.use('/api/coupons', requireDatabase, couponRoutes);
  app.use('/api/chat', requireDatabase, chatRoutes);


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
