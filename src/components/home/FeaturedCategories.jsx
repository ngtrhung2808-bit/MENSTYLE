import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  {
    id: 1,
    title: 'Áo Polo Nam',
    subTitle: 'Thoáng Mát • Trẻ Trung',
    items: '12+ mẫu mới',
    targetCategory: 'Áo Polo',
    image: 'https://cdn.hstatic.net/products/200000690725/hstp904_cv__2__3b3713f0f3a64832a607c63b6bdc4bb4.webp'
  },
  {
    id: 2,
    title: 'Áo Sơ Mi Nam',
    subTitle: 'Modal Silk • Chống Nhăn',
    items: 'Thiết kế công sở',
    targetCategory: 'Áo Sơ Mi',
    image: 'https://cdn.hstatic.net/products/200000690725/_tdt3787_55384645419_o_9eb6316f754e49f59fbfb250ed92b056.jpg'
  },
  {
    id: 3,
    title: 'Quần Âu & Jean',
    subTitle: 'Co Giãn • Tôn Phom Chân',
    items: '13+ mẫu hot',
    targetCategory: 'Quần Âu & Jean',
    image: 'https://cdn.hstatic.net/products/200000690725/hsbk801_cv_87b8a1c7cf094a1fa9ca9c002a7a62c8.webp'
  },
  {
    id: 4,
    title: 'Áo Khoác & Blazer',
    subTitle: 'Chuẩn Phong Độ Quý Ông',
    items: '16+ mẫu cao cấp',
    targetCategory: 'Áo Khoác & Blazer',
    image: 'https://cdn.hstatic.net/products/200000690725/hsbk801_to_n_f0a1612b08aa46359ffec2e0d8f83319.webp'
  }
];

export const FeaturedCategories = ({ onSelectCategory }) => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2 sm:gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Danh mục thời trang Torano
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mt-1">Lựa Chọn Hoàn Hảo Cho Quý Ông</h2>
        </div>
        <button 
          onClick={() => onSelectCategory && onSelectCategory('Tất cả')}
          className="inline-flex items-center text-xs sm:text-sm font-bold text-neutral-900 hover:text-amber-600 transition group cursor-pointer"
        >
          Xem tất cả sản phẩm
          <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory && onSelectCategory(cat.targetCategory)}
            className="group relative overflow-hidden rounded-2xl bg-neutral-900 aspect-[3/4] shadow-sm hover:shadow-xl transition-all duration-300 text-left cursor-pointer border border-neutral-100"
          >
            {/* Ảnh danh mục thực tế Torano */}
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108 filter brightness-95 group-hover:brightness-100"
            />

            {/* Gradient Overlay tạo độ tương phản */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent opacity-85 group-hover:opacity-90 transition" />

            {/* Text Content */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white z-10 flex flex-col justify-end">
              <span className="text-[10px] sm:text-xs font-semibold text-amber-300 block mb-1">
                {cat.subTitle}
              </span>
              <h3 className="font-black text-base sm:text-xl leading-tight text-white group-hover:text-amber-300 transition">
                {cat.title}
              </h3>
              <div className="mt-2 flex items-center justify-between pt-2 border-t border-white/15 text-[11px] text-neutral-300">
                <span>{cat.items}</span>
                <span className="text-amber-400 font-bold group-hover:translate-x-1 transition flex items-center gap-0.5">
                  Mua ngay <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
