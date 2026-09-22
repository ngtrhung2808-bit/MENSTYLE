import React from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { FeaturedCategories } from './components/home/FeaturedCategories';
import { ProductCard } from './components/product/ProductCard';
import { Button } from './components/common/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Áo Blazer Oversize Dáng Hàn Quốc',
    category: 'Áo khoác & Blazer',
    price: 680000,
    originalPrice: 850000,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
    isNew: true,
  },
  {
    id: 2,
    name: 'Áo Sơ Mi Linen Cổ Tàu Thoáng Mát',
    category: 'Sơ mi Nam',
    price: 399000,
    originalPrice: 450000,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop',
    isNew: false,
  },
  {
    id: 3,
    name: 'Đầm Lụa Satin Suông Xẻ Tà Sang Trọng',
    category: 'Đầm thiết kế',
    price: 890000,
    originalPrice: 1200000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop',
    isNew: true,
  },
  {
    id: 4,
    name: 'Quần Tây Ống Rộng Xếp Ly Cao Cấp',
    category: 'Quần âu',
    price: 450000,
    originalPrice: 550000,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
    isNew: false,
  },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 selection:bg-brand-500 selection:text-white">
      {/* 1. Header Navigation */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Banner */}
        <HeroBanner />

        {/* 3. Featured Categories */}
        <FeaturedCategories />

        {/* 4. Best Seller / Trending Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Sản phẩm thịnh hành
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">Được Yêu Thích Nhất Tuần</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="rounded-full">Mới nhất</Button>
              <Button variant="outline" size="sm" className="rounded-full">Bán chạy</Button>
              <Button variant="ghost" size="sm" className="rounded-full text-brand-600">Giảm giá sốc</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="rounded-full border-neutral-300 px-8 hover:border-neutral-900">
              Xem toàn bộ 250+ sản phẩm <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* 5. Newsletter Promotion Bar */}
        <section className="bg-neutral-900 text-white py-16 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight">Đăng ký nhận ưu đãi độc quyền</h2>
            <p className="text-neutral-400 text-sm max-w-lg mx-auto">
              Nhận voucher giảm giá 100k cho đơn hàng đầu tiên và thông báo sớm nhất về các đợt Flash Sale giới hạn.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-4">
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-brand-400 text-white"
              />
              <Button variant="brand" size="md" className="rounded-xl px-6">
                Đăng ký
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
