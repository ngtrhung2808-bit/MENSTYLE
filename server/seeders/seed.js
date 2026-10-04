import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import {
  Role,
  User,
  UserProfile,
  UserAddress,
  LoyaltyMembership,
  Category,
  Product,
  ProductVariant,
  ProductAttribute,
  SizeGuide,
  InventoryStock,
  Cart,
  CartItem,
  Wishlist,
  Order,
  OrderItem,
  OrderStatusHistory,
  PaymentTransaction,
  Shipment,
  OrderReturn,
  CouponPromotion,
  CouponUsage,
  BannerSlider,
  ReviewRating,
  ReviewReply,
  AiChatConversation,
  StoreBranch,
  AuditLog
} from '../models/index.js';

dotenv.config();

const seedFullDatabase = async () => {
  try {
    console.log('🔄 Đang kết nối tới MongoDB Atlas Cluster NgaLQ...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Kết nối thành công! Đang dọn dẹp và nạp toàn bộ 28 Collections...');

    // 0. Xóa trắng dữ liệu cũ
    await Promise.all([
      Role.deleteMany({}),
      User.deleteMany({}),
      UserProfile.deleteMany({}),
      UserAddress.deleteMany({}),
      LoyaltyMembership.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      ProductVariant.deleteMany({}),
      ProductAttribute.deleteMany({}),
      SizeGuide.deleteMany({}),
      InventoryStock.deleteMany({}),
      Cart.deleteMany({}),
      CartItem.deleteMany({}),
      Wishlist.deleteMany({}),
      Order.deleteMany({}),
      OrderItem.deleteMany({}),
      OrderStatusHistory.deleteMany({}),
      PaymentTransaction.deleteMany({}),
      Shipment.deleteMany({}),
      OrderReturn.deleteMany({}),
      CouponPromotion.deleteMany({}),
      CouponUsage.deleteMany({}),
      BannerSlider.deleteMany({}),
      ReviewRating.deleteMany({}),
      ReviewReply.deleteMany({}),
      AiChatConversation.deleteMany({}),
      StoreBranch.deleteMany({}),
      AuditLog.deleteMany({})
    ]);

    // 1. Phân hệ 1 - Auth & Users
    const roles = await Role.insertMany([
      { name: 'guest', displayName: 'Khách vãng lai', description: 'Xem catalog, tìm kiếm, giỏ hàng', permissions: ['products.read'] },
      { name: 'customer', displayName: 'Khách hàng thành viên', description: 'Tài khoản mua sắm, tích điểm', permissions: ['products.read', 'orders.create'] },
      { name: 'staff', displayName: 'Nhân viên vận hành', description: 'Quản lý kho, đơn hàng, CSKH', permissions: ['orders.manage', 'inventory.manage'] },
      { name: 'super_admin', displayName: 'Quản trị viên tối cao', description: 'Toàn quyền hệ thống', permissions: ['*'] }
    ]);

    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('Admin@123456', salt);
    const userPass = await bcrypt.hash('User@123456', salt);

    const users = await User.insertMany([
      { name: 'Quản Trị Viên (Super Admin)', email: 'admin@menstyle.vn', phone: '0901234567', password: adminPass, role: 'super_admin', points: 1000, tier: 'Diamond' },
      { name: 'Lê Quỳnh Nga', email: 'lqnga112@gmail.com', phone: '0987654321', password: userPass, role: 'customer', points: 250, tier: 'Gold' }
    ]);

    const customerUser = users[1];

    await UserProfile.create({
      userId: customerUser._id,
      gender: 'female',
      birthDate: new Date('2004-11-02'),
      heightCm: 165,
      weightKg: 50,
      preferredSize: 'M',
      preferredFit: 'Regular',
      bio: 'Thích phong cách thời trang nam thanh lịch, trang nhã'
    });

    const userAddress = await UserAddress.create({
      userId: customerUser._id,
      recipientName: 'Lê Quỳnh Nga',
      phoneNumber: '0987654321',
      provinceCity: 'Hà Nội',
      district: 'Cầu Giấy',
      ward: 'Dịch Vọng Hậu',
      specificAddress: 'Số 123 Đường Xuân Thủy',
      isDefault: true,
      addressType: 'home'
    });

    await LoyaltyMembership.create({
      userId: customerUser._id,
      tierName: 'Gold',
      currentPoints: 250,
      accumulatedSpent: 2500000,
      discountPercent: 5,
      pointHistory: [{ pointsChanged: 250, reason: 'Tích điểm đơn hàng đầu tiên', orderCode: 'ORD-2026-001' }]
    });

    // 2. Phân hệ 2 - Catalog & Products
    const categories = await Category.insertMany([
      { name: 'Áo Polo Nam', slug: 'ao-polo-nam', description: 'Polo nam thoáng mát chuẩn Torano', order: 1 },
      { name: 'Áo Sơ Mi Nam', slug: 'ao-so-mi-nam', description: 'Sơ mi công sở chống nhăn', order: 2 },
      { name: 'Quần Âu & Khaki', slug: 'quan-au-khaki', description: 'Quần âu co giãn 4 chiều lịch lãm', order: 3 },
      { name: 'Áo Khoác & Blazer', slug: 'ao-khoac-blazer', description: 'Áo khoác gió, blazer quý ông', order: 4 }
    ]);

    await ProductAttribute.insertMany([
      { name: 'Chất liệu', code: 'material', values: [{ value: 'Pima Cotton' }, { value: 'Sợi tre Bamboo' }, { value: 'Poly Spandex' }] },
      { name: 'Kiểu dáng', code: 'fit', values: [{ value: 'Slimfit' }, { value: 'Regular' }, { value: 'Relaxed' }] }
    ]);

    await SizeGuide.create({
      categoryId: categories[0]._id,
      title: 'Bảng quy đổi Size Áo Polo Nam',
      sizeTable: [
        { size: 'M', heightRangeCm: { min: 160, max: 168 }, weightRangeKg: { min: 50, max: 60 } },
        { size: 'L', heightRangeCm: { min: 168, max: 175 }, weightRangeKg: { min: 60, max: 70 } },
        { size: 'XL', heightRangeCm: { min: 175, max: 182 }, weightRangeKg: { min: 70, max: 80 } }
      ]
    });

    const products = await Product.insertMany([
      {
        name: 'Áo Polo Pima Cotton Cao Cấp',
        slug: 'ao-polo-pima-cotton-cao-cap',
        sku: 'PL-PIMA-01',
        category: categories[0]._id,
        price: 349000,
        originalPrice: 450000,
        discountPercent: 22,
        description: 'Chất liệu bông Pima mềm mịn, thoáng mát.',
        thumbnail: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop'],
        colors: [{ name: 'Xanh Navy', code: '#0f2027' }, { name: 'Trắng Sữa', code: '#f5f5f5' }],
        sizes: ['M', 'L', 'XL'],
        isFeatured: true,
        isBestSeller: true,
        rating: 5.0,
        reviewCount: 42,
        totalStock: 150
      },
      {
        name: 'Áo Sơ Mi Sợi Tre Bamboo Kháng Khuẩn',
        slug: 'ao-so-mi-soi-tre-bamboo-khang-khuan',
        sku: 'SM-BAMBOO-02',
        category: categories[1]._id,
        price: 499000,
        originalPrice: 599000,
        discountPercent: 17,
        description: 'Chống nhăn tự nhiên, thấm hút kháng khuẩn cực tốt.',
        thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop'],
        colors: [{ name: 'Trắng', code: '#ffffff' }],
        sizes: ['39', '40', '41'],
        isFeatured: true,
        rating: 4.8,
        reviewCount: 28,
        totalStock: 90
      }
    ]);

    const poloProduct = products[0];

    const variants = await ProductVariant.insertMany([
      { productId: poloProduct._id, sku: 'PL-PIMA-01-NAVY-M', color: 'Xanh Navy', colorCode: '#0f2027', size: 'M', stock: 50 },
      { productId: poloProduct._id, sku: 'PL-PIMA-01-NAVY-L', color: 'Xanh Navy', colorCode: '#0f2027', size: 'L', stock: 50 },
      { productId: poloProduct._id, sku: 'PL-PIMA-01-WHITE-M', color: 'Trắng Sữa', colorCode: '#f5f5f5', size: 'M', stock: 50 }
    ]);

    // 3. Phân hệ 3 - Inventory
    const storeBranch = await StoreBranch.create({
      branchName: 'MenStyle Flagship Store Hà Nội',
      branchCode: 'HN-01',
      phoneNumber: '0243.999.8888',
      provinceCity: 'Hà Nội',
      district: 'Cầu Giấy',
      address: '241 Xuân Thủy, Cầu Giấy, Hà Nội'
    });

    await InventoryStock.create({
      variantId: variants[0]._id,
      branchId: storeBranch._id,
      quantityOnHand: 50,
      quantityReserved: 2,
      lowStockThreshold: 10
    });

    // 4. Phân hệ 4 - Orders & Shopping
    const cart = await Cart.create({
      userId: customerUser._id,
      totalItems: 1,
      subtotalAmount: 349000
    });

    await CartItem.create({
      cartId: cart._id,
      productId: poloProduct._id,
      variantId: variants[0]._id,
      quantity: 1,
      unitPrice: 349000
    });

    await Wishlist.create({
      userId: customerUser._id,
      productId: poloProduct._id
    });

    const order = await Order.create({
      orderCode: 'ORD-2026-001',
      userId: customerUser._id,
      guestInfo: {
        fullName: 'Lê Quỳnh Nga',
        phone: '0987654321',
        address: 'Số 123 Đường Xuân Thủy, Cầu Giấy, Hà Nội'
      },
      totalAmount: 349000,
      shippingFee: 30000,
      discountAmount: 30000,
      finalAmount: 349000,
      paymentMethod: 'COD',
      paymentStatus: 'paid',
      orderStatus: 'delivered'
    });

    await OrderItem.create({
      orderId: order._id,
      productId: poloProduct._id,
      variantId: variants[0]._id,
      productName: poloProduct.name,
      thumbnail: poloProduct.thumbnail,
      color: 'Xanh Navy',
      size: 'M',
      price: 349000,
      quantity: 1,
      subtotal: 349000
    });

    await OrderStatusHistory.create({
      orderId: order._id,
      previousStatus: 'shipping',
      newStatus: 'delivered',
      changedBy: users[0]._id,
      note: 'Khách hàng đã nhận kiện hàng thành công'
    });

    await PaymentTransaction.create({
      orderId: order._id,
      transactionCode: 'TXN-COD-998877',
      provider: 'COD',
      amount: 349000,
      status: 'success'
    });

    await Shipment.create({
      orderId: order._id,
      trackingNumber: 'GHN-VN-11022004',
      carrier: 'GHN',
      shippingStatus: 'delivered',
      receiverAddress: userAddress.specificAddress
    });

    await OrderReturn.create({
      orderId: order._id,
      userId: customerUser._id,
      reason: 'Đổi cỡ áo sang size L',
      status: 'approved',
      refundAmount: 0,
      staffNote: 'Đồng ý hỗ trợ đổi size theo chính sách 7 ngày'
    });

    // 5. Phân hệ 5 - Marketing & Customer Experience
    const coupon = await CouponPromotion.create({
      code: 'MENSTYLE2026',
      title: 'Voucher Khai Trương Giảm 30K',
      description: 'Giảm 30.000 VNĐ cho đơn từ 300K',
      discountType: 'fixed_amount',
      discountValue: 30000,
      minOrderValue: 300000,
      usageLimitTotal: 500,
      usageCount: 1,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31')
    });

    await CouponUsage.create({
      couponId: coupon._id,
      userId: customerUser._id,
      orderId: order._id,
      discountApplied: 30000
    });

    await BannerSlider.create({
      title: 'BỘ SƯU TẬP XUÂN HÈ 2026 - MENSTYLE',
      subtitle: 'Phong cách quý ông hiện đại',
      imageUrl: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&auto=format&fit=crop',
      position: 'home_hero',
      order: 1
    });

    const review = await ReviewRating.create({
      productId: poloProduct._id,
      userId: customerUser._id,
      orderId: order._id,
      rating: 5,
      comment: 'Vải polo rất mịn, mát và đứng phom, đường may rất chỉn chu!',
      feedbackFit: 'Vừa vặn'
    });

    await ReviewReply.create({
      reviewId: review._id,
      userId: users[0]._id,
      replyContent: 'Cảm ơn bạn đã tin chọn MenStyle! Chúc bạn luôn tự tin và phong độ!'
    });

    await AiChatConversation.create({
      userId: customerUser._id,
      sessionId: 'sess_11022004',
      messages: [
        { sender: 'user', text: 'Tư vấn cho tôi mẫu áo polo đi làm công sở mát mẻ' },
        { sender: 'assistant', text: 'Chào bạn! MenStyle xin gợi ý mẫu Áo Polo Pima Cotton Cao Cấp dệt thoáng khí rất thích hợp môi trường công sở năng động!', suggestedProductIds: [poloProduct._id] }
      ]
    });

    // 6. Phân hệ 6 - System
    await AuditLog.create({
      userId: users[0]._id,
      userEmail: 'admin@menstyle.vn',
      action: 'SYSTEM_SEED_ALL_COLLECTIONS',
      collectionName: 'ALL_28_COLLECTIONS',
      documentId: 'INIT_2026',
      details: { message: 'Đã khởi tạo và đồng bộ hoàn chỉnh 28 Collections MongoDB' },
      ipAddress: '127.0.0.1',
      userAgent: 'NodeJS Seeder Script'
    });

    console.log('\n========================================================');
    console.log('🎉 [ĐÃ NẠP TOÀN BỘ 28 COLLECTIONS LÊN MONGODB ATLAS NGALQ] 🎉');
    console.log('1. Auth (5): roles, users, userprofiles, useraddresses, loyaltymemberships');
    console.log('2. Catalog (5): categories, products, productvariants, productattributes, sizeguides');
    console.log('3. Inventory (1): inventorystocks');
    console.log('4. Order (9): carts, cartitems, wishlists, orders, orderitems, orderstatushistories, paymenttransactions, shipments, orderreturns');
    console.log('5. Marketing (6): couponpromotions, couponusages, bannersliders, reviewratings, reviewreplies, aichatconversations');
    console.log('6. System (2): storebranches, auditlogs');
    console.log('👉 Tổng cộng: 28 Collections đã có Document thật 100%!');
    console.log('========================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed 28 collections:', error);
    process.exit(1);
  }
};

seedFullDatabase();
