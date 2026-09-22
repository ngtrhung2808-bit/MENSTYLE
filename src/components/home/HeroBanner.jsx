import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Inputs';

export const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6">
      {/* Background Decor & Image Overlay Nam Tính */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
      <img
        src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop"
        alt="Thời trang nam cao cấp MENSTYLE"
        className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay opacity-60"
      />

      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28 lg:py-32 flex flex-col items-start max-w-2xl">
        <Badge variant="brand" className="mb-4 bg-amber-500/20 text-amber-300 border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Men's Collection 2026
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] mb-6">
          Bản Lĩnh Đàn Ông <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-stone-200">
            Lịch Lãm & Đẳng Cấp
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 mb-8 leading-relaxed font-normal">
          Khám phá những mẫu Suit, Blazer may đo chuẩn phom dáng đàn ông Việt, áo sơ mi chống nhăn và quần âu cao cấp cho quý ông hiện đại.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="lg" className="rounded-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold shadow-lg shadow-amber-500/20">
            Xem bộ sưu tập Nam <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-full !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 backdrop-blur-sm">
            Phong cách Quý Ông
          </Button>
        </div>

        {/* Feature Badges dưới Hero */}
        <div className="grid grid-cols-3 gap-6 pt-12 mt-4 border-t border-neutral-800/80 w-full text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Giao nhanh 2h toàn quốc</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Đổi size tận nơi 15 ngày</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Chất liệu vải may đo cao cấp</span>
          </div>
        </div>
      </div>
    </section>
  );
};
