// Mock data sản phẩm chuẩn phong cách thời trang nam MENSTYLE với hình ảnh độ phân giải cao Unsplash chính xác từng phân loại
export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Áo Blazer Nam Italian Wool Dáng Slim-fit',
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
    isNew: true,
    colors: [
      { name: 'Đen Sang Trọng', hex: '#1c1917' },
      { name: 'Xanh Navy', hex: '#1e3a8a' },
      { name: 'Ghi Xám', hex: '#64748b' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Chiếc áo Blazer phong cách Ý lịch lãm, chất vải len cao cấp thoáng mát, tôn dáng chuẩn mực phái mạnh trong các sự kiện và môi trường công sở.'
  },
  {
    id: 2,
    name: 'Áo Sơ Mi Trắng Kháng Khuẩn Chống Nhăn Luxury',
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
    isNew: false,
    colors: [
      { name: 'Trắng Tinh Khôi', hex: '#ffffff' },
      { name: 'Xanh Nhạt', hex: '#e0f2fe' }
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'Chất liệu sợi tre Bamboo tự nhiên, dệt công nghệ nano chống nhăn vượt trội, giữ phom áo phẳng phiu cả ngày dài.'
  },
  {
    id: 3,
    name: 'Áo Polo Nam Pima Cotton Bo Dệt Cao Cấp',
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
    isNew: true,
    colors: [
      { name: 'Đen Huyền Bí', hex: '#171717' },
      { name: 'Xanh Rêu', hex: '#3f6212' },
      { name: 'Trắng Kem', hex: '#fef3c7' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Dòng sợi bông Pima mềm mượt, thấm hút mồ hôi tối đa, cổ áo bo dệt tinh tế không bao giờ bai gião.'
  },
  {
    id: 4,
    name: 'Quần Tây Nam Co Giãn 4 Chiều Xếp Ly Nhẹ',
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
    isNew: false,
    colors: [
      { name: 'Xám Than', hex: '#334155' },
      { name: 'Đen Classic', hex: '#0a0a0a' },
      { name: 'Be Sáng', hex: '#d6d3d1' }
    ],
    sizes: ['29', '30', '31', '32', '34'],
    description: 'Thiết kế cạp thông minh co giãn linh hoạt, ly quần sắc nét tôn dáng chân thẳng và vẻ đĩnh đạc.'
  },
  {
    id: 5,
    name: 'Bộ Suit Nam Cổ Điển May Đo British Tailored',
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
    isNew: true,
    colors: [
      { name: 'Xanh Navy Hoàng Gia', hex: '#1e3a8a' },
      { name: 'Đen Tuyển', hex: '#0f172a' }
    ],
    sizes: ['M', 'L', 'XL'],
    description: 'Bộ suit may đo cao cấp theo chuẩn quý tộc Anh, chất vải len tự nhiên dày dặn, đứng phom và toát lên sự đĩnh đạc tuyệt đối.'
  },
  {
    id: 6,
    name: 'Áo Sơ Mi Nam Kẻ Sọc Xanh Oxford Vintage',
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
    isNew: true,
    colors: [
      { name: 'Kẻ Sọc Xanh', hex: '#38bdf8' },
      { name: 'Kẻ Sọc Xám', hex: '#94a3b8' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Vải dệt Oxford kinh điển, độ thoáng khí cao, họa tiết kẻ sọc thanh lịch dễ dàng phối cùng blazer hoặc quần jean.'
  },
  {
    id: 7,
    name: 'Quần Jean Nam Slim Straight Wash Xanh Đậm',
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
    isNew: false,
    colors: [
      { name: 'Xanh Chàm Đậm', hex: '#1e293b' },
      { name: 'Xanh Retro', hex: '#0284c7' }
    ],
    sizes: ['29', '30', '31', '32', '34'],
    description: 'Chất jean cotton 12.5oz pha sợi elastane đàn hồi nhẹ, giặt wash tự nhiên không phai màu, phom ôm vừa phải.'
  },
  {
    id: 8,
    name: 'Thắt Lưng Nam Da Bò Thật Khóa Tự Động Sang Trọng',
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
    isNew: false,
    colors: [
      { name: 'Đen Bóng', hex: '#09090b' },
      { name: 'Nâu Đậm', hex: '#451a03' }
    ],
    sizes: ['Free Size'],
    description: '100% da bò lớp đầu tiên mềm bền, khóa trượt ray tiện dụng mạ hợp kim titan chống gỉ xước.'
  }
];

export const CATEGORIES = [
  'Tất cả',
  'Áo Sơ Mi',
  'Áo Polo',
  'Blazer & Suit',
  'Quần Âu & Jean',
  'Phụ Kiện'
];

export const SIZES = ['S', 'M', 'L', 'XL', '2XL', '29', '30', '31', '32', '34'];
