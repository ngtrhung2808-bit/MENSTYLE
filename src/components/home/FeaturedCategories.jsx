import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 1,
    title: 'Blazer & Suit Nam',
    items: '45+ mẫu',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Sơ Mi Chống Nhăn',
    items: '68+ mẫu',
    image: 'https://images.unsplash.com/photo-1620012253295-c15c429fbb3e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Áo Polo Thể Thao',
    items: '36+ màu',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Quần Tây & Khaki',
    items: '52+ dáng',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600&auto=format&fit=crop',
  },
];

export const FeaturedCategories = ({ onSelectCategory }) => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2 sm:gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Danh mục thời trang nam</span>
          <h2 className="text-xl sm:text-3xl font-black text-neutral-900 mt-1">Lựa Chọn Hoàn Hảo Cho Quý Ông</h2>
        </div>
        <button 
          onClick={() => onSelectCategory && onSelectCategory('Tất cả')}
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-neutral-900 hover:text-amber-600 transition group cursor-pointer"
        >
          Xem tất cả danh mục
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory && onSelectCategory(cat.targetCategory || cat.title)}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 aspect-[3/4] shadow-sm hover:shadow-md transition duration-300 text-left cursor-pointer"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 text-white">
              <span className="text-[10px] sm:text-[11px] font-medium text-amber-300 block mb-0.5 sm:mb-1">{cat.items}</span>
              <h3 className="font-bold text-sm sm:text-lg leading-tight group-hover:text-amber-300 transition">
                {cat.title}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
