// 1. Phân hệ Xác thực & Người dùng (Auth)
import Role from './auth/Role.js';
import User from './auth/User.js';
import UserProfile from './auth/UserProfile.js';
import UserAddress from './auth/UserAddress.js';
import LoyaltyMembership from './auth/LoyaltyMembership.js';

// 2. Phân hệ Danh mục & Sản phẩm (Catalog)
import Category from './catalog/Category.js';
import Product from './catalog/Product.js';
import ProductVariant from './catalog/ProductVariant.js';
import ProductAttribute from './catalog/ProductAttribute.js';
import SizeGuide from './catalog/SizeGuide.js';

// 3. Phân hệ Kho hàng & Tồn kho (Inventory)
import InventoryStock from './inventory/InventoryStock.js';

// 4. Phân hệ Giỏ hàng, Đơn hàng & Thanh toán (Order)
import Cart from './order/Cart.js';
import CartItem from './order/CartItem.js';
import Wishlist from './order/Wishlist.js';
import Order from './order/Order.js';
import OrderItem from './order/OrderItem.js';
import OrderStatusHistory from './order/OrderStatusHistory.js';
import PaymentTransaction from './order/PaymentTransaction.js';
import Shipment from './order/Shipment.js';
import OrderReturn from './order/OrderReturn.js';

// 5. Phân hệ Marketing & Tương tác khách hàng (Marketing)
import CouponPromotion from './marketing/CouponPromotion.js';
import CouponUsage from './marketing/CouponUsage.js';
import BannerSlider from './marketing/BannerSlider.js';
import ReviewRating from './marketing/ReviewRating.js';
import ReviewReply from './marketing/ReviewReply.js';
import AiChatConversation from './marketing/AiChatConversation.js';

// 6. Phân hệ Hệ thống & Vận hành (System)
import StoreBranch from './system/StoreBranch.js';
import AuditLog from './system/AuditLog.js';

export {
  // Auth
  Role,
  User,
  UserProfile,
  UserAddress,
  LoyaltyMembership,
  // Catalog
  Category,
  Product,
  ProductVariant,
  ProductAttribute,
  SizeGuide,
  // Inventory
  InventoryStock,
  // Order
  Cart,
  CartItem,
  Wishlist,
  Order,
  OrderItem,
  OrderStatusHistory,
  PaymentTransaction,
  Shipment,
  OrderReturn,
  // Marketing
  CouponPromotion,
  CouponUsage,
  BannerSlider,
  ReviewRating,
  ReviewReply,
  AiChatConversation,
  // System
  StoreBranch,
  AuditLog
};
