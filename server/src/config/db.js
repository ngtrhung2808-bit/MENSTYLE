import mongoose from 'mongoose';

/**
 * Sanitize MongoDB URI to conceal passwords/credentials in logs
 */
export const sanitizeMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return '';
  return uri.replace(/\/\/(.*?):(.*?)@/, '//***:***@');
};

/**
 * Maps Mongoose readyState (0, 1, 2, 3) to human-readable status string
 */
export const getDatabaseState = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

let isConnecting = false;
let lastAttemptTime = 0;
const RETRY_COOLDOWN_MS = 15000; // 15 seconds cooldown between reconnection attempts

export const connectDB = async (isRetry = false) => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Prevent duplicate concurrent connection attempts
  if (mongoose.connection.readyState === 2 || isConnecting) {
    return null;
  }

  const now = Date.now();
  if (isRetry && now - lastAttemptTime < RETRY_COOLDOWN_MS) {
    return null;
  }

  isConnecting = true;
  lastAttemptTime = now;

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/menstyle_db';
  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 3000,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    if (!isRetry) {
      console.warn(`[MongoDB] Warning: Không thể kết nối tới MongoDB (${error.message})`);
      console.warn(`[MongoDB] URI cấu hình: ${sanitizeMongoUri(uri)}`);
      console.warn(`[MongoDB] Server vẫn khởi động ở chế độ Degraded (API sẵn sàng, Database chờ kết nối).`);
      console.warn(`[MongoDB] Hướng dẫn: Khởi động dịch vụ MongoDB (mongod / service) hoặc cấu hình MONGODB_URI MongoDB Atlas trong file .env`);
    }
    return null;
  } finally {
    isConnecting = false;
  }
};


mongoose.connection.on('connected', () => {
  console.log('[MongoDB] Mongoose event: Connected to database successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Mongoose event: Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Mongoose event: Reconnected to database.');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed due to application termination.');
  } finally {
    process.exit(0);
  }
});

