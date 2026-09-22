import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 1,
    title: 'Áo Blazer & Vest',
    items: '48+ sản phẩm',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Sơ Mi Tối Giản',
    items: '64+ sản phẩm',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Đầm & Váy Dự Tiệc',
    items: '32+ sản phẩm',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Quần Âu & Jean',
    items: '52+ sản phẩm',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
  },
];

export const FeaturedCategories = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Danh mục tuyển chọn</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">Xu Hướng Thời Trang Nổi Bật</h2>
        </div>
        <a href="#" className="inline-flex items-center text-sm font-semibold text-neutral-900 hover:text-brand-600 transition group">
          Xem tất cả danh mục 
          <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href="#"
            className="group relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[3/4] shadow-sm hover:shadow-md transition duration-300"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white">
              <span className="text-[11px] font-medium text-neutral-300 block mb-1">{cat.items}</span>
              <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-brand-300 transition">
                {cat.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
