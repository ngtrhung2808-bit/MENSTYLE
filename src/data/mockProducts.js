// Mock data sản phẩm chuẩn phong cách thời trang nam MENSTYLE
export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Áo Blazer Nam Italian Wool Dáng Slim-fit',
    category: 'Blazer & Suit',
    price: 1250000,
    originalPrice: 1550000,
    discount: 20,
    rating: 4.9,
    reviewCount: 42,
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
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop'
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
    name: 'Áo Khoác Bomber Nam Da Lộn Minimalist',
    category: 'Blazer & Suit',
    price: 890000,
    originalPrice: 1100000,
    discount: 19,
    rating: 4.9,
    reviewCount: 38,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=800&auto=format&fit=crop'
    ],
    isNew: true,
    colors: [
      { name: 'Nâu Rêu', hex: '#78350f' },
      { name: 'Đen Nhám', hex: '#18181b' }
    ],
    sizes: ['M', 'L', 'XL'],
    description: 'Chất da lộn nhân tạo cao cấp mềm mại, khóa zip kim loại YKK trơn tru, dáng bomber hiện đại trẻ trung.'
  },
  {
    id: 6,
    name: 'Thắt Lưng Nam Da Bò Thật Khóa Tự Động',
    category: 'Phụ Kiện',
    price: 350000,
    originalPrice: 450000,
    discount: 22,
    rating: 5.0,
    reviewCount: 154,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop'
    ],
    isNew: false,
    colors: [
      { name: 'Đen Bóng', hex: '#09090b' },
      { name: 'Nâu Đậm', hex: '#451a03' }
    ],
    sizes: ['Free Size'],
    description: '100% da bò lớp đầu tiên bền đẹp theo năm tháng, mặt khóa kim loại chống trầy xước sang trọng.'
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

export const SIZES = ['S', 'M', 'L', 'XL', '2XL', '29', '30', '31', '32'];
