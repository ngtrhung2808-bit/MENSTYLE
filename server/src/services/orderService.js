import { Order } from '../models/Order.js';
import { Variant } from '../models/Variant.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Coupon } from '../models/Coupon.js';
import { validateCouponCode } from './couponService.js';

export const createOrder = async (orderData, userId = null) => {
  const {
    fullName,
    phone,
    email,
    address,
    province,
    district,
    note,
    paymentMethod,
    couponCode,
    items
  } = orderData;

  // 1. Calculate subTotal
  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 2. Calculate shippingFee (Free for >= 500k, otherwise 30k)
  const shippingFee = subTotal >= 500000 || subTotal === 0 ? 0 : 30000;

  // 3. Calculate discount from coupon if provided
  let discountAmount = 0;
  if (couponCode && couponCode.trim()) {
    try {
      const couponResult = await validateCouponCode(couponCode, subTotal);
      discountAmount = couponResult.discountAmount;
      // Increment coupon usedCount
      await Coupon.findOneAndUpdate(
        { code: couponCode.trim().toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    } catch (err) {
      // Re-throw if invalid coupon
      throw new Error(err.message);
    }
  }

  const grandTotal = Math.max(0, subTotal + shippingFee - discountAmount);
  const orderCode = Order.generateOrderCode();

  // 4. Create Order document
  const order = await Order.create({
    orderCode,
    userId,
    customerInfo: {
      fullName,
      phone,
      email,
      address,
      district,
      province,
      note
    },
    items,
    subTotal,
    shippingFee,
    discountAmount,
    couponCode: couponCode ? couponCode.trim().toUpperCase() : '',
    grandTotal,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    orderStatus: 'pending'
  });

  // 5. Update stock quantities and product sales
  for (const item of items) {
    if (item.variantId) {
      await Variant.findByIdAndUpdate(item.variantId, {
        $inc: { stockQuantity: -item.quantity }
      });
    }
    if (item.productId) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { totalSold: item.quantity }
      });
    }
  }

  // 6. Accumulate loyalty points for logged-in user (1% of grandTotal)
  if (userId) {
    const earnedPoints = Math.floor(grandTotal / 10000); // 1 point per 10,000 VND
    await User.findByIdAndUpdate(userId, {
      $inc: { points: earnedPoints }
    });
  }

  return order;
};

export const getOrdersByUserId = async (userId) => {
  return Order.find({ userId }).sort({ createdAt: -1 });
};

export const getAdminStats = async () => {
  const [totalRevenueResult, totalOrders, totalCustomers, lowStockCount, recentOrders] = await Promise.all([
    Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } }
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Variant.countDocuments({ stockQuantity: { $lte: 10 } }),
    Order.find().sort({ createdAt: -1 }).limit(10)
  ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    lowStockCount,
    recentOrders
  };
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: newStatus },
    { new: true }
  );
  if (!order) throw new Error('Không tìm thấy đơn hàng');
  return order;
};
