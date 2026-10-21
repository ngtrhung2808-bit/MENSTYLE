import { Order } from '../models/Order.js';
import { Variant } from '../models/Variant.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Coupon } from '../models/Coupon.js';
import { validateCouponCode } from './couponService.js';
import { resolveOrderItem } from './orderPricing.js';

const orderError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

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

  // Resolve catalog prices and variants from MongoDB; never trust the browser's prices.
  const resolvedItems = [];
  const productHasVariants = new Map();
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || product.isActive === false) {
      throw orderError('Sản phẩm không tồn tại hoặc đã ngừng kinh doanh', 404);
    }

    let variant = null;
    if (item.variantId) {
      variant = await Variant.findById(item.variantId);
    } else {
      variant = await Variant.findOne({
        productId: product._id,
        size: item.selectedSize,
        'color.name': item.selectedColor,
        isActive: true
      });
    }
    let hasVariants = productHasVariants.get(String(product._id));
    if (hasVariants === undefined) {
      hasVariants = Boolean(await Variant.exists({ productId: product._id }));
      productHasVariants.set(String(product._id), hasVariants);
    }
    resolvedItems.push(resolveOrderItem({ input: item, product, variant, productHasVariants: hasVariants }));
  }

  const subTotal = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 2. Calculate shippingFee (Free for >= 500k, otherwise 30k)
  const shippingFee = subTotal >= 500000 || subTotal === 0 ? 0 : 30000;

  // 3. Calculate discount from coupon if provided
  let discountAmount = 0;
  let normalizedCouponCode = '';
  if (couponCode && couponCode.trim()) {
    normalizedCouponCode = couponCode.trim().toUpperCase();
    const couponResult = await validateCouponCode(normalizedCouponCode, subTotal);
    discountAmount = couponResult.discountAmount;
  }

  const grandTotal = Math.max(0, subTotal + shippingFee - discountAmount);
  const orderCode = Order.generateOrderCode();

  // Reserve inventory atomically before order creation to prevent overselling.
  const reservations = [];
  let couponReserved = false;
  let order;
  try {
    for (const item of resolvedItems) {
      if (!item.variantId) continue;
      const reservedVariant = await Variant.findOneAndUpdate(
        { _id: item.variantId, isActive: true, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } }
      );
      if (!reservedVariant) {
        throw orderError('Tồn kho không đủ cho một hoặc nhiều sản phẩm đã chọn', 409);
      }
      reservations.push({ variantId: item.variantId, quantity: item.quantity });
    }

    if (normalizedCouponCode) {
      const now = new Date();
      const coupon = await Coupon.findOneAndUpdate(
        {
          code: normalizedCouponCode,
          isActive: true,
          startDate: { $lte: now },
          endDate: { $gte: now },
          $expr: { $lt: ['$usedCount', '$usageLimit'] }
        },
        { $inc: { usedCount: 1 } }
      );
      if (!coupon) throw orderError('Mã giảm giá vừa hết hạn hoặc hết lượt sử dụng', 400);
      couponReserved = true;
    }

    order = await Order.create({
      orderCode,
      userId,
      customerInfo: { fullName, phone, email, address, district, province, note },
      items: resolvedItems,
      subTotal,
      shippingFee,
      discountAmount,
      couponCode: normalizedCouponCode,
      grandTotal,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });
  } catch (error) {
    await Promise.allSettled(reservations.map(({ variantId, quantity }) =>
      Variant.findByIdAndUpdate(variantId, { $inc: { stockQuantity: quantity } })
    ));
    if (couponReserved) {
      await Coupon.findOneAndUpdate({ code: normalizedCouponCode }, { $inc: { usedCount: -1 } });
    }
    throw error;
  }

  // These counters are secondary to the saved order; do not report order failure after persistence.
  try {
    await Promise.all(resolvedItems.map((item) => Product.findByIdAndUpdate(item.productId, {
      $inc: { totalSold: item.quantity }
    })));
  } catch (error) {
    console.error('[Orders] Order saved, but product sales counters could not be updated:', error.message);
  }

  // 6. Accumulate loyalty points for logged-in user (1% of grandTotal)
  if (userId) {
    const earnedPoints = Math.floor(grandTotal / 10000); // 1 point per 10,000 VND
    try {
      await User.findByIdAndUpdate(userId, { $inc: { points: earnedPoints } });
    } catch (error) {
      console.error('[Orders] Order saved, but loyalty points could not be updated:', error.message);
    }
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

export const getAdminOrders = async () => Order.find().sort({ createdAt: -1 }).limit(500);

export const updateOrderStatus = async (orderId, newStatus) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: newStatus },
    { returnDocument: 'after', runValidators: true }
  );
  if (!order) throw new Error('Không tìm thấy đơn hàng');
  return order;
};
