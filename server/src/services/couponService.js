import { Coupon } from '../models/Coupon.js';

const couponValidationError = (message) => Object.assign(new Error(message), { statusCode: 400 });

export const validateCouponCode = async (code, subTotal) => {
  if (typeof code !== 'string' || !code.trim()) {
    throw couponValidationError('Vui lòng cung cấp mã voucher');
  }
  if (!Number.isFinite(subTotal) || subTotal < 0) {
    throw couponValidationError('Tổng đơn hàng không hợp lệ');
  }

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    isActive: true
  });

  if (!coupon) {
    throw couponValidationError('Mã voucher không hợp lệ hoặc đã hết hạn!');
  }

  let discountAmount;
  try {
    discountAmount = coupon.calculateDiscount(subTotal);
  } catch (error) {
    error.statusCode = 400;
    throw error;
  }

  return {
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount
  };
};
