import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  User,
  Category,
  Product,
  Variant,
  Coupon,
  Order,
  Cart,
  Payment,
  Review,
  Wishlist,
  AI_Conversation
} from '../models/index.js';

dotenv.config();

const categoriesData = [
  { name: 'Blazer & Suit', slug: 'blazer-suit', description: 'Blazer may đo và suit quý ông sang trọng chuẩn phong cách Ý & Anh', displayOrder: 1 },
  { name: 'Áo Sơ Mi', slug: 'ao-so-mi', description: 'Sơ mi nano chống nhăn, sợi tre cao cấp cho doanh nhân', displayOrder: 2 },
  { name: 'Áo Polo', slug: 'ao-polo', description: 'Polo Pima cotton dệt bo sang trọng, năng động', displayOrder: 3 },
  { name: 'Quần Âu & Jean', slug: 'quan-au-jean', description: 'Quần âu co giãn 4 chiều và denim wash phong trần', displayOrder: 4 },
  { name: 'Phụ Kiện', slug: 'phu-kien', description: 'Thắt lưng da bò, kính mắt thời trang và phụ kiện nam giới', displayOrder: 5 }
];

const mockProductsData = [
  {
    name: 'Áo Blazer Nam Italian Wool Dáng Slim-fit',
    slug: 'ao-blazer-nam-italian-wool-dang-slim-fit',
    category: 'Blazer & Suit',
    price: 1250000,
    originalPrice: 1550000,
    discount: 20,
    rating: 4.9,
    reviewCount: 52,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop'
    ],
    isNewProduct: true,
    colors: [
      { name: 'Đen Sang Trọng', hex: '#1c1917' },
      { name: 'Xanh Navy', hex: '#1e3a8a' },
      { name: 'Ghi Xám', hex: '#64748b' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Chiếc áo Blazer phong cách Ý lịch lãm, chất vải len cao cấp thoáng mát, tôn dáng chuẩn mực phái mạnh trong các sự kiện và môi trường công sở.',
    tags: ['blazer', 'suit', 'len ý', 'tiệc tối', 'công sở', 'slim-fit', 'sang trọng']
  },
  {
    name: 'Áo Sơ Mi Trắng Kháng Khuẩn Chống Nhăn Luxury',
    slug: 'ao-so-mi-trang-khang-khuan-chong-nhan-luxury',
    category: 'Áo Sơ Mi',
    price: 450000,
    originalPrice: 550000,
    discount: 18,
    rating: 4.8,
    reviewCount: 118,
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15c429fbb3e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop'
    ],
    isNewProduct: false,
    colors: [
      { name: 'Trắng Tinh Khôi', hex: '#ffffff' },
      { name: 'Xanh Nhạt', hex: '#e0f2fe' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'Chất liệu sợi tre Bamboo tự nhiên, dệt công nghệ nano chống nhăn vượt trội, giữ phom áo phẳng phiu cả ngày dài.',
    tags: ['sơ mi', 'trắng', 'nano', 'chống nhăn', 'công sở', 'bamboo']
  },
  {
    name: 'Áo Polo Nam Pima Cotton Bo Dệt Cao Cấp',
    slug: 'ao-polo-nam-pima-cotton-bo-det-cao-cap',
    category: 'Áo Polo',
    price: 380000,
    originalPrice: 480000,
    discount: 21,
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800&auto=format&fit=crop'
    ],
    isNewProduct: true,
    colors: [
      { name: 'Đen Huyền Bí', hex: '#171717' },
      { name: 'Xanh Rêu', hex: '#3f6212' },
      { name: 'Trắng Kem', hex: '#fef3c7' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Dòng sợi bông Pima mềm mượt, thấm hút mồ hôi tối đa, cổ áo bo dệt tinh tế không bao giờ bai gião.',
    tags: ['polo', 'pima cotton', 'dạo phố', 'năng động', 'thoáng mát']
  },
  {
    name: 'Quần Tây Nam Co Giãn 4 Chiều Xếp Ly Nhẹ',
    slug: 'quan-tay-nam-co-gian-4-chieu-xep-ly-nhe',
    category: 'Quần Âu & Jean',
    price: 520000,
    originalPrice: 650000,
    discount: 20,
    rating: 4.9,
    reviewCount: 65,
    images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'
    ],
    isNewProduct: false,
    colors: [
      { name: 'Xám Than', hex: '#334155' },
      { name: 'Đen Classic', hex: '#0a0a0a' },
      { name: 'Be Sáng', hex: '#d6d3d1' }
    ],
    sizes: ['29', '30', '31', '32', '34'],
    description: 'Thiết kế cạp thông minh co giãn linh hoạt, ly quần sắc nét tôn dáng chân thẳng và vẻ đĩnh đạc.',
    tags: ['quần tây', 'quần âu', 'co giãn', 'công sở', 'slim']
  },
  {
    name: 'Bộ Suit Nam Cổ Điển May Đo British Tailored',
    slug: 'bo-suit-nam-co-dien-may-do-british-tailored',
    category: 'Blazer & Suit',
    price: 1850000,
    originalPrice: 2200000,
    discount: 16,
    rating: 5.0,
    reviewCount: 31,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop'
    ],
    isNewProduct: true,
    colors: [
      { name: 'Xanh Navy Hoàng Gia', hex: '#1e3a8a' },
      { name: 'Đen Tuyển', hex: '#0f172a' }
    ],
    sizes: ['M', 'L', 'XL'],
    description: 'Bộ suit may đo cao cấp theo chuẩn quý tộc Anh, chất vải len tự nhiên dày dặn, đứng phom và toát lên sự đĩnh đạc tuyệt đối.',
    tags: ['suit', 'british', 'quý tộc', 'tiệc tối', 'lễ cưới', 'may đo']
  },
  {
    name: 'Áo Sơ Mi Nam Kẻ Sọc Xanh Oxford Vintage',
    slug: 'ao-so-mi-nam-ke-soc-xanh-oxford-vintage',
    category: 'Áo Sơ Mi',
    price: 490000,
    originalPrice: 590000,
    discount: 17,
    rating: 4.8,
    reviewCount: 47,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'
    ],
    isNewProduct: true,
    colors: [
      { name: 'Kẻ Sọc Xanh', hex: '#38bdf8' },
      { name: 'Kẻ Sọc Xám', hex: '#94a3b8' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Vải dệt Oxford kinh điển, độ thoáng khí cao, họa tiết kẻ sọc thanh lịch dễ dàng phối cùng blazer hoặc quần jean.',
    tags: ['sơ mi kẻ', 'oxford', 'vintage', 'thời thượng', 'trẻ trung']
  },
  {
    name: 'Quần Jean Nam Slim Straight Wash Xanh Đậm',
    slug: 'quan-jean-nam-slim-straight-wash-xanh-dam',
    category: 'Quần Âu & Jean',
    price: 580000,
    originalPrice: 720000,
    discount: 19,
    rating: 4.7,
    reviewCount: 76,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'
    ],
    isNewProduct: false,
    colors: [
      { name: 'Xanh Chàm Đậm', hex: '#1e293b' },
      { name: 'Xanh Retro', hex: '#0284c7' }
    ],
    sizes: ['29', '30', '31', '32', '34'],
    description: 'Chất jean cotton 12.5oz pha sợi elastane đàn hồi nhẹ, giặt wash tự nhiên không phai màu, phom ôm vừa phải.',
    tags: ['jean', 'denim', 'bụi bặm', 'dạo phố', 'wash']
  },
  {
    name: 'Thắt Lưng Nam Da Bò Thật Khóa Tự Động Sang Trọng',
    slug: 'that-lung-nam-da-bo-that-khoa-tu-dong-sang-trong',
    category: 'Phụ Kiện',
    price: 350000,
    originalPrice: 450000,
    discount: 22,
    rating: 5.0,
    reviewCount: 154,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
    ],
    isNewProduct: false,
    colors: [
      { name: 'Đen Bóng', hex: '#09090b' },
      { name: 'Nâu Đậm', hex: '#451a03' }
    ],
    sizes: ['Free Size'],
    description: '100% da bò lớp đầu tiên mềm bền, khóa trượt ray tiện dụng mạ hợp kim titan chống gỉ xước.',
    tags: ['thắt lưng', 'da bò', 'phụ kiện', 'công sở', 'quà tặng']
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/menstyle_db';
    console.log(`[Seeder] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seeder] Cleaning existing collections...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Variant.deleteMany(),
      Coupon.deleteMany(),
      Order.deleteMany(),
      Cart.deleteMany(),
      Payment.deleteMany(),
      Review.deleteMany(),
      Wishlist.deleteMany(),
      AI_Conversation.deleteMany()
    ]);

    console.log('[Seeder] Seeding Users...');
    const [adminUser, customerUser] = await User.create([
      {
        fullName: 'Quản Trị Viên MENSTYLE',
        email: 'admin@menstyle.vn',
        password: 'admin123',
        role: 'admin',
        phone: '0901234567',
        memberLevel: 'Thành Viên Kim Cương',
        points: 5000
      },
      {
        fullName: 'Quý Ông MENSTYLE',
        email: 'quyong@menstyle.vn',
        password: 'quyong123',
        role: 'customer',
        phone: '0912345678',
        memberLevel: 'Thành Viên Bạc',
        points: 100,
        addresses: [
          {
            fullName: 'Quý Ông MENSTYLE',
            phone: '0912345678',
            address: 'Số 88 Phố Huế',
            district: 'Hai Bà Trưng',
            province: 'Hà Nội',
            isDefault: true
          }
        ]
      }
    ]);

    console.log('[Seeder] Seeding Categories...');
    const insertedCategories = await Category.insertMany(categoriesData);
    const categoryMap = new Map();
    insertedCategories.forEach(cat => categoryMap.set(cat.name, cat._id));

    console.log('[Seeder] Seeding Products & Variants...');
    for (const p of mockProductsData) {
      const catId = categoryMap.get(p.category) || null;
      const productDoc = await Product.create({
        ...p,
        categoryId: catId
      });

      // Generate variants for each Color x Size combination
      const variantsToCreate = [];
      let variantIdx = 1;
      for (const color of p.colors) {
        for (const size of p.sizes) {
          const skuCode = `${productDoc.slug.substring(0, 8).toUpperCase()}-${size}-${color.name.substring(0, 3).toUpperCase()}-${variantIdx++}`;
          variantsToCreate.push({
            productId: productDoc._id,
            sku: skuCode,
            size,
            color,
            price: productDoc.price,
            stockQuantity: 50,
            image: productDoc.images[0] || ''
          });
        }
      }
      await Variant.insertMany(variantsToCreate);
    }

    console.log('[Seeder] Seeding Coupons...');
    await Coupon.create({
      code: 'MENSTYLE20',
      description: 'Voucher ưu đãi 20% toàn bộ đơn hàng thời trang nam MENSTYLE',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 0,
      maxDiscountAmount: 500000,
      usageLimit: 1000,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2027-12-31'),
      isActive: true
    });

    console.log('[Seeder] Seeding Sample Orders...');
    const sampleProducts = await Product.find().limit(2);
    const sampleOrderCode = Order.generateOrderCode();
    const orderDoc = await Order.create({
      orderCode: sampleOrderCode,
      userId: customerUser._id,
      customerInfo: {
        fullName: 'Lê Hoàng Nam',
        phone: '0987654321',
        email: 'hoangnam@gmail.com',
        address: '124 Hoàng Hoa Thám',
        district: 'Ba Đình',
        province: 'Hà Nội',
        note: 'Giao giờ hành chính giúp tôi'
      },
      items: [
        {
          productId: sampleProducts[0]._id,
          name: sampleProducts[0].name,
          selectedSize: 'L',
          selectedColor: 'Đen Sang Trọng',
          price: sampleProducts[0].price,
          quantity: 1,
          image: sampleProducts[0].images[0]
        }
      ],
      subTotal: sampleProducts[0].price,
      shippingFee: 0,
      discountAmount: 0,
      grandTotal: sampleProducts[0].price,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'delivering'
    });

    console.log('[Seeder] Seeding Sample Reviews...');
    await Review.create({
      productId: sampleProducts[0]._id,
      userId: customerUser._id,
      userName: customerUser.fullName,
      orderId: orderDoc._id,
      rating: 5,
      comment: 'Áo chất vải len mềm mịn, phom slim fit mặc cực kỳ tôn dáng và lịch sự. Rất hài lòng!',
      isVerifiedPurchase: true
    });

    console.log('[Seeder] Seeding Sample AI Conversation...');
    await AI_Conversation.create({
      sessionId: 'session_demo_guest_001',
      userId: customerUser._id,
      messages: [
        {
          sender: 'bot',
          text: 'Xin chào quý ông! Tôi là Stylist AI từ MENSTYLE. Tôi có thể giúp gì cho bạn hôm nay?',
          suggestedProducts: [],
          metadata: { intent: 'welcome' }
        },
        {
          sender: 'user',
          text: 'Cách phối đồ Blazer đi tiệc tối',
          metadata: { intent: 'style_recommendation', extractedEntities: { category: 'Blazer & Suit' } }
        },
        {
          sender: 'bot',
          text: 'Với sự kiện hoặc tiệc tối, bạn nên phối Áo Blazer Italian Wool Đen cùng Sơ mi trắng Nano và Giày da Oxford để có vẻ ngoài lịch lãm, quyền lực nhất!',
          suggestedProducts: [sampleProducts[0]._id],
          metadata: { intent: 'style_recommendation' }
        }
      ],
      contextSummary: 'Tư vấn trang phục dạ tiệc với Blazer'
    });

    console.log('----------------------------------------------------');
    console.log('✅ SEEDER COMPLETED SUCCESSFULLY!');
    console.log('Admin Account: admin@menstyle.vn / admin123');
    console.log('Customer Account: quyong@menstyle.vn / quyong123');
    console.log('Coupon Code: MENSTYLE20 (Giảm 20%)');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDER ERROR:', error);
    process.exit(1);
  }
};

seedData();
