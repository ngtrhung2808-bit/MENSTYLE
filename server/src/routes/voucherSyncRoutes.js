import express from 'express';
import { Coupon } from '../models/Coupon.js';

const router = express.Router();

// Lấy toàn bộ danh sách vouchers
router.get('/', async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
});

// Tạo hoặc cập nhật voucher
router.post('/sync', async (req, res, next) => {
  try {
    const { vouchers } = req.body;
    if (!Array.isArray(vouchers)) {
      return res.status(400).json({ success: false, message: 'vouchers phải là mảng' });
    }

    for (const v of vouchers) {
      if (!v.code) continue;
      const cleanCode = v.code.trim().toUpperCase();
      const discountType = v.percent > 0 ? 'percentage' : 'fixed_amount';
      const discountValue = v.percent > 0 ? v.percent : (v.discountAmount || 0);

      await Coupon.findOneAndUpdate(
        { code: cleanCode },
        {
          $set: {
            code: cleanCode,
            description: v.title || `Voucher ${cleanCode}`,
            discountType,
            discountValue,
            minOrderValue: v.minOrder || 0,
            usageLimit: v.totalCount || 1000,
            usedCount: v.usedCount || 0,
            startDate: new Date('2025-01-01'),
            endDate: v.expiry ? new Date(v.expiry) : new Date('2030-12-31'),
            isActive: v.isActive !== false
          }
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ success: true, message: 'Đã đồng bộ coupons thành công vào MongoDB!' });
  } catch (error) {
    next(error);
  }
});

export default router;
