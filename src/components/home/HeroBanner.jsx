import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';
import { getStoredBanners } from '../../data/storefrontData';

const DEFAULT_SLIDES = [
  {
    id: 1,
    title: 'BỘ SƯU TẬP THU ĐÔNG 2026',
    subtitle: 'URBAN ELEGANCE • ĐẲNG CẤP PHÁI MẠNH',
    desc: 'Thiết kế Áo Khoác Gió 2 lớp Wind Light & Măng tô len Ý may đo phom chuẩn quý ông hiện đại.',
    image: '/banners/banner_fall_winter.jpg',
    category: 'Áo Khoác & Blazer',
    ctaText: 'Khám Phá BST'
  },
  {
    id: 2,
    title: 'POLO SILK TOUCH CO GIÃN',
    subtitle: 'THOÁNG MÁT TỐI ĐA • ĐỨNG FORM CẢ NGÀY',
    desc: 'Chất liệu dệt tổ ong DiamondAir kháng khuẩn, giải pháp trang phục hàng ngày thanh lịch.',
    image: '/banners/banner_polo_silk.jpg',
    category: 'Áo Polo',
    ctaText: 'Mua Ngay'
  },
  {
    id: 3,
    title: 'SMART CASUAL OFFICE COMBO',
    subtitle: 'SƠ MI MODAL SILK & QUẦN ÂU CO GIÃN 4 CHIỀU',
    desc: 'Giải pháp trang phục công sở cả tuần không cần ủi, tôn trọn vóc dáng nam tính.',
    image: '/banners/banner_smart_casual.jpg',
    category: 'Áo Sơ Mi',
    ctaText: 'Xem Bộ Sưu Tập'
  }
];

export const HeroBanner = ({ onExplore }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(() => {
    try {
      const stored = getStoredBanners();
      const active = stored.filter(b => b.isActive !== false);
      if (active.length > 0) return active;
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SLIDES;
  });

  // Tự động chuyển slide sau mỗi 6 giây
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const slide = slides[currentSlide] || slides[0] || DEFAULT_SLIDES[0];

  return (
    <div className="relative w-full overflow-hidden bg-neutral-950 select-none">
      {/* Khung ảnh Full Width Banner tỉ lệ thời trang chuẩn Torano */}
      <div className="relative w-full h-[360px] sm:h-[480px] md:h-[560px] lg:h-[640px] overflow-hidden">
        {SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Ảnh chụp mẫu MenStyle riêng biệt, độ nét cao */}
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-right sm:object-center transform transition-transform duration-7000 ease-out scale-100 hover:scale-105"
            />
            {/* Lớp gradient tinh tế bên trái để chữ cực kỳ dễ đọc mà ảnh người mẫu bên phải vẫn sáng đẹp tự nhiên */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/40 to-transparent sm:w-2/3" />

            {/* Nội dung Banner Chuẩn Phong Cách Thời Trang */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
                <div className="max-w-lg lg:max-w-xl text-white space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bộ Sưu Tập Độc Quyền MENSTYLE</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase drop-shadow-md text-white">
                    {s.title}
                  </h1>

                  <p className="text-amber-400 text-xs sm:text-sm md:text-base font-bold tracking-wide uppercase drop-shadow-sm">
                    {s.subtitle}
                  </p>

                  <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed max-w-md drop-shadow">
                    {s.desc}
                  </p>

                  <div className="pt-2 sm:pt-4 flex items-center gap-3">
                    <button
                      onClick={() => onExplore && onExplore(s.category)}
                      className="rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>{s.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onExplore && onExplore('Tất cả')}
                      className="rounded-full bg-neutral-950/60 hover:bg-neutral-900/90 text-white border border-white/30 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                    >
                      Xem Toàn Bộ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cụm Nút Điều Hướng Trái / Phải dạng mũi tên mờ */}
      <button
        onClick={() => setCurrentSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-950/40 hover:bg-neutral-950/80 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={() => setCurrentSlide((currentSlide + 1) % SLIDES.length)}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-950/40 hover:bg-neutral-950/80 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dải Indicator Dots dạng gạch thanh lịch ở đáy */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
              currentSlide === i ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
