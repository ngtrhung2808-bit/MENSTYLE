import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

const SLIDES = [
  {
    id: 1,
    badge: 'Bộ Sưu Tập SS26 • MENSTYLE Premium',
    title: 'Bản Lĩnh Đàn Ông',
    subtitle: 'Lịch Lãm & Phong Độ Mọi Khoảnh Khắc',
    desc: 'Thiết kế Polo dệt tổ ong thoáng mát, Sơ mi Modal Silk chống nhăn và Quần tây co giãn 4 chiều cho quý ông hiện đại.',
    image: 'https://cdn.hstatic.net/products/200000690725/_tdt3784_55384861295_o_05e198e142ed4422a7c3d79e1e3bea3c.jpg',
    category: 'Áo Polo',
    highlight: 'Giảm 30% Đơn Đầu'
  },
  {
    id: 2,
    badge: 'Executive Tailored Collection',
    title: 'Phong Thái Quý Tộc',
    subtitle: 'Blazer & Quần Âu May Đo Đẳng Cấp',
    desc: 'Chất vải nhập khẩu cao cấp, tôn vóc dáng mạnh mẽ, đĩnh đạc trong mọi cuộc gặp gỡ và sự kiện quan trọng.',
    image: 'https://cdn.hstatic.net/products/200000690725/hsbk801_to_n_f0a1612b08aa46359ffec2e0d8f83319.webp',
    category: 'Blazer & Suit',
    highlight: 'Hàng Mới Về'
  },
  {
    id: 3,
    badge: 'Smart Casual Daily Style',
    title: 'Thoải Mái Tối Đa',
    subtitle: 'Sơ Mi Kháng Khuẩn & Khaki Smart',
    desc: 'Giải pháp trang phục công sở cả tuần không cần ủi, thấm hút mồ hôi vượt trội chuẩn phong cách quý ông hiện đại.',
    image: 'https://cdn.hstatic.net/products/200000690725/55314495847_3ed29f720b_c_8c6d05461d6b4024a855aa1bfb857754.jpg',
    category: 'Áo Sơ Mi',
    highlight: 'Bán Chạy Nhất'
  }
];

export const HeroBanner = ({ onExplore }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white rounded-2xl sm:rounded-3xl mx-3 sm:mx-6 lg:mx-8 mt-3 sm:mt-6 border border-neutral-800 shadow-2xl">
      {/* Background Image với transition mượt mà */}
      <div className="absolute inset-0 z-0">
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover object-top filter brightness-[0.45] transition-all duration-1000 ease-in-out scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-12 py-14 sm:py-24 lg:py-32 flex flex-col items-start max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-4 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{slide.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-3 sm:mb-4 animate-in fade-in duration-500">
          {slide.title} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-white">
            {slide.subtitle}
          </span>
        </h1>

        <p className="text-xs sm:text-base text-neutral-300 mb-6 sm:mb-8 leading-relaxed font-normal max-w-lg">
          {slide.desc}
        </p>

        {/* Nút hành động */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button 
            onClick={() => onExplore && onExplore(slide.category)}
            variant="primary" 
            size="lg" 
            className="rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-7 shadow-lg shadow-amber-500/20 justify-center cursor-pointer text-xs sm:text-sm"
          >
            Khám Phá {slide.category} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button 
            onClick={() => onExplore && onExplore('Tất cả')}
            variant="outline" 
            size="lg" 
            className="rounded-xl !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 backdrop-blur-sm justify-center cursor-pointer text-xs sm:text-sm font-semibold"
          >
            Xem Tất Cả 45+ Mẫu
          </Button>
        </div>

        {/* 3 Cam kết thương hiệu phong cách MENSTYLE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 pt-8 sm:pt-10 mt-6 sm:mt-8 border-t border-white/10 w-full text-xs text-neutral-300">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Freeship từ 500k toàn quốc</span>
          </div>
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Đổi size miễn phí 7 ngày</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Chất vải cao cấp chuẩn MENSTYLE</span>
          </div>
        </div>
      </div>

      {/* Nút điều hướng Carousel (Next / Prev) */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2">
        <button 
          onClick={() => setCurrentSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/15 transition cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-1.5 px-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === i ? 'w-6 bg-amber-400' : 'w-2 bg-white/30'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={() => setCurrentSlide((currentSlide + 1) % SLIDES.length)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/15 transition cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
