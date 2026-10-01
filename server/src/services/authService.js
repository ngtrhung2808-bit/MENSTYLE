import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'menstyle_super_secret_jwt_key_2026_fashion_stylist',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const registerUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email.toLowerCase() });
  if (existingUser) {
    throw new Error('Email này đã được đăng ký tài khoản');
  }

  const user = await User.create({
    name: data.name || data.fullName,
    email: data.email.toLowerCase(),
    password: data.password,
    phone: data.phone || '',
    role: 'customer'
  });

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberLevel: user.memberLevel,
      points: user.points
    },
    token
  };
};

export const loginUser = async (emailOrUsername, password) => {
  // Support both email login and local admin login (username: 'admin')
  const query = emailOrUsername.toLowerCase() === 'admin'
    ? { role: 'admin' }
    : { email: emailOrUsername.toLowerCase() };

  const user = await User.findOne(query).select('+password');
  if (!user) {
    throw new Error('Tài khoản hoặc mật khẩu không chính xác');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Tài khoản hoặc mật khẩu không chính xác');
  }

  if (!user.isActive) {
    throw new Error('Tài khoản đã bị tạm khóa');
  }

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberLevel: user.memberLevel,
      points: user.points
    },
    token
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Không tìm thấy người dùng');
  return user;
};
