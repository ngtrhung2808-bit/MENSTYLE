import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 MENSTYLE Backend running in [${process.env.NODE_ENV || 'development'}] mode`);
    console.log(`🔗 API Server URL: http://localhost:${PORT}`);
    console.log(`🩺 Health Check:   http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
};

startServer();
