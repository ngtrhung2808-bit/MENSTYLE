import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/menstyle_db';
  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 3000,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Warning: Không thể kết nối tới MongoDB (${error.message})`);
    console.warn(`[MongoDB] Server vẫn khởi động. Vui lòng bật MongoDB service hoặc cấu hình MONGODB_URI (ví dụ: MongoDB Atlas) trong file server/.env`);
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to database.');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('[MongoDB] Connection closed due to application termination.');
  process.exit(0);
});
