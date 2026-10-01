import { Coupon } from '../models/Coupon.js';

export const validateCouponCode = async (code, subTotal) => {
  if (!code || !code.trim()) {
    throw new Error('Vui lòng cung cấp mã voucher');
  }

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    isActive: true
  });

  if (!coupon) {
    throw new Error('Mã voucher không hợp lệ hoặc đã hết hạn!');
  }

  const discountAmount = coupon.calculateDiscount(subTotal);

  return {
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount
  };
};
