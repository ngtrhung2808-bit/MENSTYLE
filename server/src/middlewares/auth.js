import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'menstyle_super_secret_jwt_key_2026_fashion_stylist');
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị khóa'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token xác thực không hợp lệ',
      error: error.message
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Quyền truy cập bị từ chối. Yêu cầu quyền: [${roles.join(', ')}]`
      });
    }
    next();
  };
};
