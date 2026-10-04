import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import Role from '../models/Role.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import Order from '../models/Order.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('🔄 Đang kết nối tới MongoDB Atlas Cluster NgaLQ...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Kết nối thành công! Bắt đầu tạo dữ liệu khởi tạo (Seed Data)...');

    // 1. Xóa dữ liệu cũ để tránh trùng lặp
    await Promise.all([
      Role.deleteMany({}),
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      ProductVariant.deleteMany({}),
      Order.deleteMany({})
    ]);
    console.log('🧹 Đã dọn dẹp collections cũ.');

    // 2. Tạo Roles (4 cấp phân quyền RBAC)
    const roles = await Role.insertMany([
      {
        name: 'guest',
        displayName: 'Khách vãng lai',
        description: 'Xem sản phẩm, tìm kiếm, giỏ hàng tạm',
        permissions: ['products.read', 'categories.read']
      },
      {
        name: 'customer',
        displayName: 'Khách hàng thành viên',
        description: 'Tài khoản mua hàng, lịch sử đơn hàng, tích điểm',
        permissions: ['products.read', 'categories.read', 'orders.create', 'orders.view_self', 'reviews.create']
      },
      {
        name: 'staff',
        displayName: 'Nhân viên vận hành',
        description: 'Quản lý sản phẩm, đơn hàng, kho và CSKH',
        permissions: ['products.manage', 'categories.manage', 'orders.manage', 'inventory.manage']
      },
      {
        name: 'super_admin',
        displayName: 'Quản trị viên tối cao',
        description: 'Toàn quyền cấu hình, nhân sự và audit log',
        permissions: ['*']
      }
    ]);
    console.log(`✅ Đã nạp ${roles.length} Roles (RBAC).`);

    // 3. Tạo Users mẫu (Admin + Khách hàng)
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123456', salt);
    const userPassword = await bcrypt.hash('User@123456', salt);

    const users = await User.insertMany([
      {
        name: 'Quản Trị Viên (Super Admin)',
        email: 'admin@menstyle.vn',
        phone: '0901234567',
        password: adminPassword,
        role: 'super_admin',
        points: 500,
        tier: 'Diamond'
      },
      {
        name: 'Lê Quỳnh Nga',
        email: 'lqnga112@gmail.com',
        phone: '0987654321',
        password: userPassword,
        role: 'customer',
        points: 120,
        tier: 'Gold'
      }
    ]);
    console.log(`✅ Đã nạp ${users.length} Users khởi tạo.`);

    // 4. Tạo Danh mục (Categories) theo chuẩn Torano
    const categories = await Category.insertMany([
      {
        name: 'Áo Polo Nam',
        slug: 'ao-polo-nam',
        description: 'Áo polo nam cao cấp thoáng mát, phom dáng thanh lịch chuẩn Torano',
        order: 1
      },
      {
        name: 'Áo Sơ Mi Nam',
        slug: 'ao-so-mi-nam',
        description: 'Sơ mi công sở, chống nhăn, kiểu dáng slimfit hiện đại',
        order: 2
      },
      {
        name: 'Quần Âu & Khaki',
        slug: 'quan-au-khaki',
        description: 'Quần âu co giãn 4 chiều lịch lãm, chuẩn phom quý ông',
        order: 3
      },
      {
        name: 'Áo Khoác & Blazer',
        slug: 'ao-khoac-blazer',
        description: 'Áo khoác gió cản nước, áo blazer nam cao cấp mùa thu đông',
        order: 4
      }
    ]);
    console.log(`✅ Đã nạp ${categories.length} Categories.`);

    // 5. Tạo Sản phẩm (Products) & Biến thể (Variants - Color x Size)
    const poloCat = categories[0]._id;
    const somiCat = categories[1]._id;
    const quanCat = categories[2]._id;

    const sampleProducts = [
      {
        name: 'Áo Polo Pima Cotton Cao Cấp',
        slug: 'ao-polo-pima-cotton-cao-cap',
        sku: 'PL-PIMA-01',
        category: poloCat,
        price: 349000,
        originalPrice: 450000,
        discountPercent: 22,
        description: 'Chất liệu sợi bông Pima thượng hạng mềm mịn, thấm hút vượt trội.',
        details: '100% Pima Cotton, dệt mắt chim tổ ong, cổ áo chống quăn.',
        thumbnail: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1625910513413-5b820a2e5c83?w=600&auto=format&fit=crop'
        ],
        colors: [
          { name: 'Xanh Navy', code: '#0f2027' },
          { name: 'Trắng Sữa', code: '#f5f5f5' }
        ],
        sizes: ['M', 'L', 'XL'],
        isFeatured: true,
        isBestSeller: true,
        rating: 4.9,
        reviewCount: 48,
        totalStock: 150
      },
      {
        name: 'Áo Sơ Mi Sợi Tre Bamboo Kháng Khuẩn',
        slug: 'ao-so-mi-soi-tre-bamboo-khang-khuan',
        sku: 'SM-BAMBOO-02',
        category: somiCat,
        price: 499000,
        originalPrice: 599000,
        discountPercent: 17,
        description: 'Vải Bamboo tự nhiên chống nhăn, kháng khuẩn và khử mùi hiệu quả.',
        details: '50% Bamboo, 50% Polyspun, form dáng Regular Fit.',
        thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop'
        ],
        colors: [
          { name: 'Trắng', code: '#ffffff' },
          { name: 'Xanh Nhạt', code: '#b0c4de' }
        ],
        sizes: ['39', '40', '41', '42'],
        isFeatured: true,
        isNewArrival: true,
        rating: 4.8,
        reviewCount: 32,
        totalStock: 120
      },
      {
        name: 'Quần Âu Nam Slimfit Co Giãn 4 Chiều',
        slug: 'quan-au-nam-slimfit-co-gian-4-chieu',
        sku: 'QA-SLIM-03',
        category: quanCat,
        price: 450000,
        originalPrice: 550000,
        discountPercent: 18,
        description: 'Quần âu may đo phong cách Hàn Quốc, co giãn thoải mái khi vận động.',
        details: '70% Polyester, 28% Rayon, 2% Spandex.',
        thumbnail: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop'
        ],
        colors: [
          { name: 'Đen', code: '#000000' },
          { name: 'Ghi Xám', code: '#808080' }
        ],
        sizes: ['29', '30', '31', '32'],
        isFeatured: false,
        isBestSeller: true,
        rating: 5.0,
        reviewCount: 75,
        totalStock: 90
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Đã nạp ${createdProducts.length} Products.`);

    // 6. Nạp Product Variants cho sản phẩm 1 (Áo Polo)
    const poloProduct = createdProducts[0];
    const variantsData = [
      { productId: poloProduct._id, sku: 'PL-PIMA-01-NAVY-M', color: 'Xanh Navy', colorCode: '#0f2027', size: 'M', stock: 25 },
      { productId: poloProduct._id, sku: 'PL-PIMA-01-NAVY-L', color: 'Xanh Navy', colorCode: '#0f2027', size: 'L', stock: 30 },
      { productId: poloProduct._id, sku: 'PL-PIMA-01-NAVY-XL', color: 'Xanh Navy', colorCode: '#0f2027', size: 'XL', stock: 20 },
      { productId: poloProduct._id, sku: 'PL-PIMA-01-WHITE-M', color: 'Trắng Sữa', colorCode: '#f5f5f5', size: 'M', stock: 25 },
      { productId: poloProduct._id, sku: 'PL-PIMA-01-WHITE-L', color: 'Trắng Sữa', colorCode: '#f5f5f5', size: 'L', stock: 30 },
      { productId: poloProduct._id, sku: 'PL-PIMA-01-WHITE-XL', color: 'Trắng Sữa', colorCode: '#f5f5f5', size: 'XL', stock: 20 }
    ];
    await ProductVariant.insertMany(variantsData);
    console.log(`✅ Đã nạp ${variantsData.length} Product Variants (Color x Size matrix).`);

    console.log('\n🎉 [HOÀN TẤT THÀNH CÔNG] Toàn bộ Database MENSTYLE đã được đưa lên MongoDB Atlas NgaLQ!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
    process.exit(1);
  }
};

seedData();
