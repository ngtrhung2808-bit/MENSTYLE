import * as couponService from '../services/couponService.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subTotal = 0 } = req.body;
    const result = await couponService.validateCouponCode(code, Number(subTotal));
    res.status(200).json({
      success: true,
      message: 'Mã giảm giá hợp lệ',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
