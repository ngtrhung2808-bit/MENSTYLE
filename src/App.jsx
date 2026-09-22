import React from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { FeaturedCategories } from './components/home/FeaturedCategories';
import { ProductCard } from './components/product/ProductCard';
import { Button } from './components/common/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

const MEN_PRODUCTS = [
  {
    id: 1,
    name: 'Áo Blazer Nam Italian Wool Dáng Slim-fit',
    category: 'Blazer & Suit Nam',
    price: 1250000,
    originalPrice: 1550000,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    isNew: true,
  },
  {
    id: 2,
    name: 'Áo Sơ Mi Trắng Kháng Khuẩn Chống Nhăn',
    category: 'Sơ Mi Công Sở Nam',
    price: 450000,
    originalPrice: 550000,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1620012253295-c15c429fbb3e?q=80&w=600&auto=format&fit=crop',
    isNew: false,
  },
  {
    id: 3,
    name: 'Áo Polo Nam Pima Cotton Cao Cấp',
    category: 'Áo Polo Nam',
    price: 380000,
    originalPrice: 480000,
    discount: 21,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop',
    isNew: true,
  },
  {
    id: 4,
    name: 'Quần Tây Nam Co Giãn 4 Chiều Xếp Ly Nhẹ',
    category: 'Quần Âu Nam',
    price: 520000,
    originalPrice: 650000,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600&auto=format&fit=crop',
    isNew: false,
  },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 selection:bg-amber-500 selection:text-neutral-950 font-sans overflow-x-hidden w-full">
      {/* 1. Header Navigation */}
      <Header />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* 2. Hero Banner */}
        <HeroBanner />

        {/* 3. Featured Categories (Nam) */}
        <FeaturedCategories />

        {/* 4. Best Seller Men Products */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Bán chạy nhất tuần
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-neutral-900 mt-1">Được Phái Mạnh Ưa Chuộng</h2>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <Button variant="secondary" size="sm" className="rounded-full text-xs shrink-0">Mới nhất</Button>
              <Button variant="outline" size="sm" className="rounded-full text-xs shrink-0">Bán chạy</Button>
              <Button variant="ghost" size="sm" className="rounded-full text-rose-600 font-semibold text-xs shrink-0">Khuyến mãi</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
            {MEN_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <Button variant="outline" size="lg" className="rounded-full border-neutral-300 px-6 sm:px-8 hover:border-neutral-900 font-bold text-xs sm:text-base w-full sm:w-auto">
              Xem toàn bộ 180+ sản phẩm Nam <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* 5. Newsletter Promotion Bar Nam Tính */}
        <section className="bg-neutral-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 border-t border-neutral-800">
          <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Gia Nhập Cộng Đồng Quý Ông MENSTYLE</h2>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto">
              Nhận voucher <strong>100.000đ</strong> cho đơn hàng đầu tiên cùng những cẩm nang phối đồ nam định kỳ từ stylist chuyên nghiệp.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2 sm:pt-4">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 text-white"
              />
              <Button variant="primary" size="md" className="rounded-xl px-6 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold justify-center">
                Đăng ký ngay
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
