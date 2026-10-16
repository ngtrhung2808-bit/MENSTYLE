import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, then root directory fallback
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB (handles timeout and offline mode gracefully)
  await connectDB();

  const app = createApp();

  const server = app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 MENSTYLE Backend running in [${process.env.NODE_ENV || 'development'}] mode`);
    console.log(`🔗 API Server URL: http://localhost:${PORT}`);
    console.log(`🩺 Health Check:   http://localhost:${PORT}/health`);
    console.log(`🩺 API Health:     http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });

  return server;
};

startServer();

